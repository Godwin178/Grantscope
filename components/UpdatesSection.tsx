import updatesData from "@/data/updates.json";

interface Update {
  date: string;
  title: string;
  detail: string;
  url: string;
}

// Newest first; the seed file is already ordered, and Array.sort is stable,
// so entries sharing a date keep their curated order.
const updates = [...(updatesData as Update[])].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export default function UpdatesSection() {
  return (
    <section className="card" id="updates">
      <h2>Latest grant updates</h2>
      <p className="muted">
        Every change we spot in the tracked programs — rounds opening,
        closing, pausing or changing — posted here as it lands. Pro members
        get these by email the moment they&apos;re published.
      </p>
      <div className="update-list">
        {updates.map((u, i) => (
          <article key={`${u.date}-${u.title}`} className="update-item">
            <div className="update-head">
              <p className="update-date muted">{u.date}</p>
              {i === 0 && <span className="badge badge-open">New</span>}
            </div>
            <h3>{u.title}</h3>
            <p className="muted">
              {u.detail}
              {u.url && (
                <>
                  {" "}
                  <a href={u.url} target="_blank" rel="noreferrer">
                    Official page ↗
                  </a>
                </>
              )}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
