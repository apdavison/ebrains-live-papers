import { useParams, useNavigate } from "react-router";
import Header from "../Header";
import Footer from "../Footer";
import DocsNav from "./DocsNav";
import Introduction from "./Introduction";
import Find from "./Find";
import Create from "./Create";
import Develop from "./Develop";
import Tutorial from "./Tutorial";
import Credits from "./Credits";
import "./docs.css";

type PageKey = "" | "find" | "create" | "develop" | "tutorial" | "credits";

type PageComponent = React.ComponentType<{ navigateTo: (page: string) => void }>;

const PAGE_MAP: Record<PageKey, PageComponent> = {
  "": Introduction,
  find: Find,
  create: Create,
  develop: Develop,
  tutorial: Tutorial,
  credits: Credits,
};

export default function Docs() {
  const { page = "" } = useParams<{ page?: string }>();
  const navigate = useNavigate();

  const navigateTo = (p: string) =>
    navigate(p ? `/docs/${p}` : "/docs");

  const Page = PAGE_MAP[page as PageKey] ?? Introduction;

  return (
    <>
      <Header />
      <DocsNav />
      <div className="docs-content">
        <Page navigateTo={navigateTo} />
      </div>
      <Footer />
    </>
  );
}
