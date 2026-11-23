export type ChainId = "ethereum" | "base";

export interface ChainInfo {
  id: ChainId;
  label: string;
  apiBase: string;
  explorerBase: string;
  nativeSymbol: string;
}

export const CHAINS: Record<ChainId, ChainInfo> = {
  ethereum: {
    id: "ethereum",
    label: "Ethereum",
    apiBase: "https://eth.blockscout.com/api/v2",
    explorerBase: "https://eth.blockscout.com",
    nativeSymbol: "ETH",
  },
  base: {
    id: "base",
    label: "Base",
    apiBase: "https://base.blockscout.com/api/v2",
    explorerBase: "https://base.blockscout.com",
    nativeSymbol: "ETH",
  },
};

export const CHAIN_LIST: ChainInfo[] = [CHAINS.ethereum, CHAINS.base];

export function isValidAddress(value: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(value.trim());
}

export interface AddressInfo {
  hash: string;
  /** Native balance in wei, as a decimal string. */
  coinBalanceWei: string;
  isContract: boolean;
  name: string | null;
}

export interface TokenTransfer {
  timestamp: string;
  transactionHash: string;
  from: string;
  to: string;
  tokenSymbol: string;
  tokenName: string;
  tokenAddress: string;
  /** Raw integer value as a decimal string. */
  value: string;
  decimals: number;
}

/** Format a raw integer token amount (given its decimals) for display. */
export function formatUnits(raw: string, decimals: number, maxFraction = 6): string {
  let value: bigint;
  try {
    value = BigInt(raw);
  } catch {
    return raw;
  }
  const negative = value < 0n;
  const abs = negative ? -value : value;
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  const fraction = abs % base;
  let fractionStr = fraction.toString().padStart(decimals, "0");
  fractionStr = fractionStr.slice(0, maxFraction).replace(/0+$/, "");
  const wholeStr = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const out = fractionStr ? `${wholeStr}.${fractionStr}` : wholeStr;
  return negative ? `-${out}` : out;
}

async function blockscoutFetch<T>(chain: ChainId, path: string): Promise<T> {
  const url = `${CHAINS[chain].apiBase}${path}`;
  let res: Response;
  try {
    res = await fetch(url, { headers: { accept: "application/json" } });
  } catch {
    throw new Error(
      `Could not reach the ${CHAINS[chain].label} explorer API. Check your connection and try again.`
    );
  }
  if (res.status === 404) {
    throw new Error("Address not found on this chain yet (no on-chain activity).");
  }
  if (!res.ok) {
    throw new Error(`Explorer API error (HTTP ${res.status}). Please try again shortly.`);
  }
  return (await res.json()) as T;
}

interface RawAddress {
  hash: string;
  coin_balance: string | null;
  is_contract: boolean;
  name: string | null;
}

export async function fetchAddressInfo(
  chain: ChainId,
  address: string
): Promise<AddressInfo> {
  const raw = await blockscoutFetch<RawAddress>(
    chain,
    `/addresses/${address.trim()}`
  );
  return {
    hash: raw.hash,
    coinBalanceWei: raw.coin_balance ?? "0",
    isContract: raw.is_contract,
    name: raw.name,
  };
}

interface RawTransferItem {
  timestamp: string;
  transaction_hash: string;
  from: { hash: string };
  to: { hash: string };
  token: {
    symbol: string | null;
    name: string | null;
    address_hash: string;
    decimals: string | null;
  };
  total: { value: string; decimals: string | null };
}

interface RawTransferPage {
  items: RawTransferItem[];
}

export async function fetchTokenTransfers(
  chain: ChainId,
  address: string
): Promise<TokenTransfer[]> {
  const page = await blockscoutFetch<RawTransferPage>(
    chain,
    `/addresses/${address.trim()}/token-transfers`
  );
  return (page.items ?? []).map((item) => ({
    timestamp: item.timestamp,
    transactionHash: item.transaction_hash,
    from: item.from?.hash ?? "",
    to: item.to?.hash ?? "",
    tokenSymbol: item.token?.symbol ?? "?",
    tokenName: item.token?.name ?? "",
    tokenAddress: item.token?.address_hash ?? "",
    value: item.total?.value ?? "0",
    decimals: Number(item.total?.decimals ?? item.token?.decimals ?? 18),
  }));
}

/** Build a CSV string from a transfer list and trigger a browser download. */
export function downloadTransfersCsv(
  address: string,
  chain: ChainId,
  transfers: TokenTransfer[]
): void {
  const header = "timestamp,transaction_hash,token,token_address,from,to,value,direction";
  const lower = address.toLowerCase();
  const rows = transfers.map((t) => {
    const direction =
      t.from.toLowerCase() === lower ? "out" : t.to.toLowerCase() === lower ? "in" : "";
    const cells = [
      t.timestamp,
      t.transactionHash,
      t.tokenSymbol,
      t.tokenAddress,
      t.from,
      t.to,
      formatUnits(t.value, t.decimals, 18),
      direction,
    ];
    return cells
      .map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c))
      .join(",");
  });
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `grantscope-${chain}-${address}-transfers.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
