import programsData from "@/data/programs.json";
import Explorer from "@/components/Explorer";
import ProSection from "@/components/ProSection";

interface Program {
  id: string;
  name: string;
  chain: string;
  funder: string;
  status: "open" | "paused" | "between-rounds";
  maxAmount: string;
  funds: string;
  link: string | null;
  notes: string;
  lastVerified: string;
}

const programs = programsData as Program[];

const STATUS_LABEL: Record<Program["status"], string> = {
  open: "Open",
  paused: "Paused",
  "between-rounds": "Between rounds",
};

export default function HomePage() {
  const openCount = programs.filter((p) => p.status === "open").length;
  return (
    <>
      <section className="card">
        <h1>Grant programs registry</h1>
        <p className="muted">
          A curated, dated registry of grant programs for builders —{" "}
          {openCount} of {programs.length} listed programs verified open as of
          the dates shown. Statuses are checked by hand; when a program is
          paused, GrantScope says so instead of sending you to a dead form.
        </p>
        <div className="program-grid">
          {programs.map((p) => (
            <article key={p.id} className="program">
              <div className="program-head">
                <h3>{p.name}</h3>
                <span className={`badge badge-${p.status}`}>
                  {STATUS_LABEL[p.status]}
                </span>
              </div>
              <dl className="program-meta">
                <div>
                  <dt>Chain</dt>
                  <dd>{p.chain}</dd>
                </div>
                <div>
                  <dt>Funder</dt>
                  <dd>{p.funder}</dd>
                </div>
                <div>
                  <dt>Amount</dt>
                  <dd>{p.maxAmount}</dd>
                </div>
              </dl>
              <p>{p.funds}</p>
              <p className="muted">{p.notes}</p>
              <p className="program-foot muted">
                Verified {p.lastVerified}
                {p.link && (
                  <>
                    {" · "}
                    <a href={p.link} target="_blank" rel="noreferrer">
                      Official page ↗
                    </a>
                  </>
                )}
              </p>
            </article>
          ))}
        </div>
      </section>

      <Explorer />

      <ProSection />
    </>
  );
}
