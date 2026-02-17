import type { LivePaper, LivePaperSummary } from "../types";
import summary from "./data/summary.json";

const aliasToId: Record<string, string> = Object.fromEntries(
  summary.data.map((lp: { id: string; alias: string }) => [lp.alias, lp.id])
);

export async function fetchPublishedLivePapers(): Promise<{ data: LivePaperSummary[] }> {
  return summary;
}

export async function fetchPublishedLivePaper(livePaperId: string): Promise<LivePaper> {
  const uuid = aliasToId[livePaperId] ?? livePaperId;
  const data = await import(`./data/${uuid}.json`);
  return data.default;
}
