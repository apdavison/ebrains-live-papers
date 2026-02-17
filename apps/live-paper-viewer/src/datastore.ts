import type { LivePaper, LivePaperSummary } from "./types";

const API_BASE = "https://live-papers-dev.apps.ebrains.eu/livepapers-published";

export async function fetchPublishedLivePapers(): Promise<{ data: LivePaperSummary[] }> {
  const response = await fetch(`${API_BASE}/`);
  return await response.json();
}

export async function fetchPublishedLivePaper(livePaperId: string): Promise<LivePaper> {
  const response = await fetch(`${API_BASE}/${livePaperId}`);
  return await response.json();
}
