import { useLoaderData } from "react-router";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import type { Person, Publication, LivePaperSection } from "./types";
import Section from "./Section";
import "./App.css";


function joinItems(index: number, size: number) {
    if (index < size - 2) {
        return ", ";
    } else if (index < size - 1) {
        return " and ";
    } else {
        return "";
    }
}

function AuthorList({ authors }: { authors: Person[] }) {
  return (
    <div>
      {authors.map((author, index, arr) => (
        <span key={`${author.family_name}=${author.given_name}`}>
          {author.given_name}&nbsp;{author.family_name}
          {author.identifier ? <a href={author.identifier}>ID</a> : ""}
          {joinItems(index, arr.length)}
          {/* todo: when clicking on name, show affiliation, plus perhaps links like "Search for other contributions by this author" */}
        </span>
      ))}
    </div>
  );
}

function RelatedPublication({ pub }: { pub: Publication }) {
    const pubDate = new Date(pub.publication_date);
  return (
    <div>
      <AuthorList authors={pub.authors} />
      ({pubDate.getFullYear()})
      <p>{pub.title}. {pub.journal} {pub.volume}:{pub.pagination} <a href={pub.doi}>{pub.doi}</a></p>
      {/* abstract should be hidden unless publication is expanded. Do we need Markdown for publication abstract? */}
      {pub.abstract}
    </div>
  );
}

function LivePaperViewer() {
  const { lp } = useLoaderData();
  console.log(lp);

  return (
    <>
      <h1>{lp.title}</h1>
      <p>open access - {lp.license}</p>
      <p>Published {lp.publication_date}</p>
      <p>Version: {lp.version}</p>
      {/* todo: if version > 1, need also date when first version was published */}
      <p>
        <a href="{lp.doi}">{lp.doi}</a>
      </p>
      <AuthorList authors={lp.authors} />

      <RelatedPublication pub={lp.related_publications[0]} />

      <Markdown rehypePlugins={[rehypeRaw]}>{lp.abstract}</Markdown>

      {lp.sections.map((section: LivePaperSection) => <Section data={section} key={section.order} />)}
    </>
  );
}

export default LivePaperViewer;
