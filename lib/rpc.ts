import type { ChainId } from "./blockscout";

/**
 * Direct JSON-RPC fallback data source.
 *
 * Blockscout is the primary source for wallet data, but some of its
 * instances reject requests from some networks (base.blockscout.com
 * returns HTTP 403 from datacenter IPs; bsc.blockscout.com does not
 * answer API requests from them at all). When the explorer API is
 * unreachable we fall back to
 * plain JSON-RPC against public endpoints: native balance via
 * eth_getBalance and balances for a curated token list via eth_call
 * balanceOf. Transfer history is NOT available from this fallback (public
 * RPCs cap eth_getLogs to tiny block ranges), so callers show balances
 * only and say so.
 */

export const RPC_ENDPOINTS: Record<ChainId, string[]> = {
  base: ["https://mainnet.base.org", "https://base-rpc.publicnode.com"],
  ethereum: ["https://ethereum-rpc.publicnode.com", "https://eth.llamarpc.com"],
  bsc: [
    "https://bsc-dataseed.bnbchain.org",
    "https://bsc-dataseed1.bnbchain.org",
    "https://bsc-rpc.publicnode.com",
  ],
};

export interface TokenDef {
  symbol: string;
  address: string;
  decimals: number;
}

export const TOKEN_LISTS: Record<ChainId, TokenDef[]> = {
  base: [
    { symbol: "USDC", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6 },
    { symbol: "USDbC", address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", decimals: 6 },
    { symbol: "WETH", address: "0x4200000000000000000000000000000000000006", decimals: 18 },
    { symbol: "DAI", address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", decimals: 18 },
    { symbol: "USDT", address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2", decimals: 6 },
    { symbol: "cbBTC", address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf", decimals: 8 },
    { symbol: "AERO", address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631", decimals: 18 },
  ],
  ethereum: [
    { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
    { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
    { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
    { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
  ],
  // All seven verified live via eth_call (symbol + decimals) on
  // 2026-11-22; every one reports 18 decimals on BSC.
  bsc: [
    { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
    { symbol: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 18 },
    { symbol: "WBNB", address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", decimals: 18 },
    { symbol: "BUSD", address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", decimals: 18 },
    { symbol: "CAKE", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", decimals: 18 },
    { symbol: "ETH", address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", decimals: 18 },
    { symbol: "DAI", address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", decimals: 18 },
  ],
};

export interface TokenBalance {
  symbol: string;
  address: string;
  decimals: number;
  /** Raw integer balance as a decimal string. */
  rawBalance: string;
}

const HEX_UINT = /^0x[0-9a-fA-F]+$/;

/** One JSON-RPC call, trying the chain's public endpoints in order
 *  (one retry per endpoint, to ride out transient throttling). */
async function rpcCall(chain: ChainId, method: string, params: unknown[]): Promise<unknown> {
  let lastError: Error = new Error(`All ${chain} RPC endpoints failed.`);
  for (const url of RPC_ENDPOINTS[chain]) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        });
        if (!res.ok) throw new Error(`RPC HTTP ${res.status} from ${url}`);
        const json = (await res.json()) as {
          result?: unknown;
          error?: { message?: string };
        };
        if (json.error) {
          throw new Error(json.error.message ?? `RPC error from ${url}`);
        }
        return json.result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }
    }
  }
  throw lastError;
}

function hexToDecimalString(result: unknown): string {
  if (typeof result !== "string" || !HEX_UINT.test(result)) {
    throw new Error(`Unexpected RPC result: ${String(result)}`);
  }
  return BigInt(result).toString();
}

/** Native (ETH) balance in wei, as a decimal string, via eth_getBalance. */
export async function rpcGetNativeBalanceWei(
  chain: ChainId,
  address: string
): Promise<string> {
  const result = await rpcCall(chain, "eth_getBalance", [address.trim(), "latest"]);
  return hexToDecimalString(result);
}

const BALANCE_OF_SELECTOR = "0x70a08231";

/**
 * ERC-20 balanceOf for one token contract, as a decimal string.
 * Throws unless the contract returns a valid hex uint (an empty "0x"
 * response means the address is not a readable ERC-20 contract).
 */
export async function rpcBalanceOf(
  chain: ChainId,
  tokenAddress: string,
  address: string
): Promise<string> {
  const data =
    BALANCE_OF_SELECTOR + address.trim().toLowerCase().replace(/^0x/, "").padStart(64, "0");
  const result = await rpcCall(chain, "eth_call", [
    { to: tokenAddress, data },
    "latest",
  ]);
  return hexToDecimalString(result);
}

/**
 * Balances for the chain's curated token list. Tokens whose balanceOf
 * call fails on every endpoint are skipped; if every call fails the
 * whole lookup throws so callers can surface a real error.
 */
export async function rpcGetTokenBalances(
  chain: ChainId,
  address: string
): Promise<TokenBalance[]> {
  const tokens = TOKEN_LISTS[chain];
  const results = await Promise.allSettled(
    tokens.map((t) => rpcBalanceOf(chain, t.address, address))
  );
  const balances: TokenBalance[] = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      balances.push({
        symbol: tokens[i].symbol,
        address: tokens[i].address,
        decimals: tokens[i].decimals,
        rawBalance: r.value,
      });
    }
  });
  if (balances.length === 0 && tokens.length > 0) {
    throw new Error(`Could not read any token balances on ${chain} via RPC.`);
  }
  return balances;
}
