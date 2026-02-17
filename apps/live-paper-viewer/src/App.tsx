import { useLoaderData } from "react-router";
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'
import type { LivePaperSummary } from "./types";
import "./App.css";


function App() {
  const { data } = useLoaderData();
  console.log(data);

  return (
    <>
      <h1>list of live papers</h1>
      {data.data.map((lp: LivePaperSummary) => (
        <div key={lp.id}>
          <p>
            <a href={lp.alias ?? undefined}>{lp.title}</a>
          </p>
          <p>Live Paper published | {lp.publication_date}</p>
          <p>
            <a href={lp.doi ?? undefined}>{lp.doi}</a>
          </p>
          <p>Version {lp.version}</p>
          <Markdown rehypePlugins={[rehypeRaw]}>
            {lp.abstract}
          </Markdown>
          <hr />
        </div>
      ))}
    </>
  );
}

export default App;
