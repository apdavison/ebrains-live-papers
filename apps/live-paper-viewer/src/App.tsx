import { useLoaderData } from "react-router";
import type { LivePaperSummary, Person } from "./types";
import Header from "./Header";
import "./App.css";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAuthors(authors: Person[]): string {
  if (authors.length === 0) return "";
  const names = authors.map(a => `${a.given_name} ${a.family_name}`);
  if (names.length <= 3) return names.join(", ");
  return `${names.slice(0, 3).join(", ")} et al.`;
}

function PaperCard({ lp }: { lp: LivePaperSummary }) {
  const href = lp.alias ?? lp.id;
  return (
    <article className="paper-card">
      <h2 className="paper-card-title">
        <a href={href}>{lp.title}</a>
      </h2>
      {lp.authors.length > 0 && (
        <p className="paper-card-authors">{formatAuthors(lp.authors)}</p>
      )}
      <div className="paper-card-meta">
        {lp.publication_date && (
          <span className="paper-card-date">{formatDate(lp.publication_date)}</span>
        )}
        {lp.doi && (
          <a className="paper-card-doi" href={lp.doi} target="_blank" rel="noreferrer">
            DOI
          </a>
        )}
      </div>
      {lp.abstract && (
        <div className="paper-card-abstract">{lp.abstract}</div>
      )}
    </article>
  );
}

function App() {
  const { data } = useLoaderData();

  return (
    <>
      <Header />
      <main className="listing-page">
        <h1>Live Papers</h1>
        <div className="paper-grid">
          {data.data.map((lp: LivePaperSummary) => (
            <PaperCard key={lp.id} lp={lp} />
          ))}
        </div>
      </main>
    </>
  );
}

export default App;
