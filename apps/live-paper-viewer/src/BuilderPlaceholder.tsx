import Header from "./Header";
import Footer from "./Footer";

export default function BuilderPlaceholder() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: "var(--max-width)", margin: "4rem auto", padding: "0 2rem" }}>
        <h1>Live Paper Builder — Coming Soon</h1>
        <p>
          Version 2 of the live paper authoring tool is currently in development
          and not yet available here.
        </p>
        <p>
          In the meantime, you can use the{" "}
          <a
            href="https://live-papers.apps.ebrains.eu/builder/"
            target="_blank"
            rel="noreferrer"
          >
            current Live Paper Builder
          </a>{" "}
          on the production site.
        </p>
      </main>
      <Footer />
    </>
  );
}
