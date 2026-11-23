"use client";

import { useEffect, useState } from "react";
import WalletTracker, { Selection } from "./WalletTracker";
import Watchlist, {
  WatchEntry,
  loadWatchlist,
  saveWatchlist,
} from "./Watchlist";

export default function Explorer() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [watchlist, setWatchlist] = useState<WatchEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setWatchlist(loadWatchlist());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveWatchlist(watchlist);
  }, [watchlist, hydrated]);

  function addToWatchlist(sel: Selection) {
    const exists = watchlist.some(
      (e) => e.chain === sel.chain && e.address.toLowerCase() === sel.address.toLowerCase()
    );
    if (exists) {
      setNotice("That wallet is already on your watchlist.");
      return;
    }
    setWatchlist([
      ...watchlist,
      { address: sel.address, label: "Watched wallet", chain: sel.chain },
    ]);
    setNotice("Saved to your watchlist (scroll down to rename it by removing and re-adding with a label).");
  }

  return (
    <>
      <WalletTracker
        selection={selection}
        onSelect={setSelection}
        onAddToWatchlist={addToWatchlist}
      />
      {notice && <p className="notice">{notice}</p>}
      <Watchlist entries={watchlist} onChange={setWatchlist} onSelect={setSelection} />
    </>
  );
}
