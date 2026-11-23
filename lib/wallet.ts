import {
  AddressInfo,
  ChainId,
  CHAINS,
  fetchAddressInfo,
  fetchTokenTransfers,
  formatUnits,
  TokenTransfer,
} from "./blockscout";
import {
  rpcGetNativeBalanceWei,
  rpcGetTokenBalances,
  TokenBalance,
} from "./rpc";

/**
 * Combined wallet data. "full" comes from Blockscout (balance + transfer
 * history). "balances" is the RPC fallback used when the explorer API is
 * unreachable: live native + token balances, but no transfer history.
 */
export type WalletData =
  | { mode: "full"; info: AddressInfo; transfers: TokenTransfer[] }
  | { mode: "balances"; info: AddressInfo; tokenBalances: TokenBalance[] };

export async function fetchWalletData(
  chain: ChainId,
  address: string
): Promise<WalletData> {
  try {
    const [info, transfers] = await Promise.all([
      fetchAddressInfo(chain, address),
      fetchTokenTransfers(chain, address),
    ]);
    return { mode: "full", info, transfers };
  } catch {
    // Explorer API unreachable (e.g. base.blockscout.com returns 403 from
    // some networks) — fall back to live balances over plain JSON-RPC.
    const [nativeWei, tokenBalances] = await Promise.all([
      rpcGetNativeBalanceWei(chain, address),
      rpcGetTokenBalances(chain, address),
    ]);
    const info: AddressInfo = {
      hash: address.trim(),
      coinBalanceWei: nativeWei,
      isContract: false,
      name: null,
    };
    return { mode: "balances", info, tokenBalances };
  }
}

/**
 * Address info with the RPC fallback applied to the balance lookup, so
 * balance-only consumers (the watchlist) keep working when the explorer
 * API is unreachable.
 */
export async function fetchAddressInfoWithFallback(
  chain: ChainId,
  address: string
): Promise<AddressInfo> {
  try {
    return await fetchAddressInfo(chain, address);
  } catch {
    const nativeWei = await rpcGetNativeBalanceWei(chain, address);
    return {
      hash: address.trim(),
      coinBalanceWei: nativeWei,
      isContract: false,
      name: null,
    };
  }
}

/** Build a CSV of fallback-mode balances (native + tokens) and download it. */
export function downloadBalancesCsv(
  address: string,
  chain: ChainId,
  nativeBalanceWei: string,
  tokenBalances: TokenBalance[]
): void {
  const header = "token,token_address,balance";
  const rows: string[][] = [
    [CHAINS[chain].nativeSymbol, "native", formatUnits(nativeBalanceWei, 18, 18)],
    ...tokenBalances.map((t) => [
      t.symbol,
      t.address,
      formatUnits(t.rawBalance, t.decimals, 18),
    ]),
  ];
  const csv = [
    header,
    ...rows.map((cells) =>
      cells
        .map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c))
        .join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `grantscope-${chain}-${address}-balances.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
