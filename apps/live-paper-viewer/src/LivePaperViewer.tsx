import { useState } from "react";
import { useLoaderData } from "react-router";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import type { Contributor, Publication, LivePaperSection } from "./types";
import Section from "./Section";
import Header from "./Header";
import Footer from "./Footer";
import "./LivePaperViewer.css";

function DoiCopy({ doi }: { doi: string }) {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    navigator.clipboard.writeText(doi).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button className="doi-copy" onClick={handleClick} title="Copy DOI">
      {doi}
      <span className="doi-copy-label">{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function AuthorList({ authors }: { authors: Contributor[] }) {
  const allAffiliations: string[] = [];
  for (const author of authors) {
    for (const aff of author.affiliations) {
      if (!allAffiliations.includes(aff)) allAffiliations.push(aff);
    }
  }
  const affIndex = new Map(allAffiliations.map((a, i) => [a, i + 1]));

  return (
    <div>
      <div className="article-authors">
        {authors.map((author, index) => (
          <span key={`${author.family_name}-${author.given_name}`}>
            {author.given_name} {author.family_name}
            {allAffiliations.length > 1 && (
              <sup className="article-author-affiliation-num">
                {author.affiliations
                  .map(a => affIndex.get(a) as number)
                  .sort((a, b) => a - b)
                  .join(",")}
              </sup>
            )}
            {author.identifier && (
              <a
                className="article-author-orcid"
                href={author.identifier}
                target="_blank"
                rel="noreferrer"
                title="ORCID profile"
              >
                iD
              </a>
            )}
            {index < authors.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
      {allAffiliations.length === 1 && (
        <p className="article-affiliations-single">{allAffiliations[0]}</p>
      )}
      {allAffiliations.length > 1 && (
        <ol className="article-affiliations">
          {allAffiliations.map(aff => <li key={aff}>{aff}</li>)}
        </ol>
      )}
    </div>
  );
}

function RelatedPublication({ pub }: { pub: Publication }) {
  const year = new Date(pub.publication_date).getFullYear();
  const authorNames = pub.authors
    .slice(0, 3)
    .map(a => `${a.family_name} ${a.given_name[0]}.`)
    .join(", ");
  const etAl = pub.authors.length > 3 ? " et al." : "";
  const parts = [
    `${authorNames}${etAl} (${year}).`,
    pub.title + ".",
    pub.journal,
    pub.volume ?? "",
    pub.pagination ? `:${pub.pagination}` : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="related-publication">
      <details>
        <summary>Related publication</summary>
        <p className="related-publication-cite">
          {parts}
          {pub.doi && (
            <> <a href={pub.doi} target="_blank" rel="noreferrer">{pub.doi}</a></>
          )}
        </p>
        {pub.abstract && (
          <p className="related-publication-abstract">{pub.abstract}</p>
        )}
      </details>
    </div>
  );
}

function LivePaperViewer() {
  const { lp } = useLoaderData();

  const tocItems = lp.sections.map((s: LivePaperSection) => ({
    title: s.title,
    id: slugify(s.title),
  }));

  return (
    <>
      <Header />
      <main className="article-page">
        <header className="article-header">
          <h1 className="article-title">{lp.title}</h1>
          <AuthorList authors={lp.authors} />
          <div className="article-meta">
            {lp.publication_date && (
              <span>Published {formatDate(lp.publication_date)}</span>
            )}
            {lp.version && <span>Version {lp.version}</span>}
            {lp.license.length > 0 && <span>{lp.license.join(", ")}</span>}
            {lp.doi && <DoiCopy doi={lp.doi} />}
          </div>
          {lp.related_publications.length > 0 && (
            <RelatedPublication pub={lp.related_publications[0]} />
          )}
        </header>

        <div className="article-layout">
          <aside className="toc-sidebar">
            <nav aria-label="Article sections">
              <p className="toc-sidebar-title">Contents</p>
              <ul className="toc-list">
                {lp.abstract && <li><a href="#abstract">Abstract</a></li>}
                {tocItems.map((item: { title: string; id: string }) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.title}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="article-content">
            {lp.abstract && (
              <section id="abstract" className="abstract-block">
                <h2 className="abstract-heading">Abstract</h2>
                <Markdown rehypePlugins={[rehypeRaw]}>{lp.abstract}</Markdown>
              </section>
            )}

            {lp.sections.map((section: LivePaperSection) => (
              <Section data={section} key={section.order} id={slugify(section.title)} />
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default LivePaperViewer;
