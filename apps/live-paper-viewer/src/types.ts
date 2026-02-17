export interface Person {
  given_name: string;
  family_name: string;
  identifier: string | null;
}

export interface Contributor extends Person {
  affiliations: string[];
  roles: string[];
}

export interface Link {
  url: string;
  service: string;
}

export interface LivePaperDataItem {
  label: string;
  links: Link[];
  type: string;
  identifier: string;
}

export interface LivePaperSection {
  order: number;
  type: string;
  title: string;
  text: string | null;
  data: LivePaperDataItem[];
}

export interface Publication {
  authors: Contributor[];
  publication_date: string;
  title: string;
  journal: string;
  volume: string | null;
  issue: string | null;
  pagination: string | null;
  abstract: string | null;
  url: string | null;
  doi: string | null;
}

export interface LivePaper {
  lp_tool_version: string;
  id: string;
  title: string;
  alias: string | null;
  publication_date: string | null;
  version: string | null;
  authors: Contributor[];
  abstract: string | null;
  related_publications: Publication[];
  doi: string | null;
  license: string[];
  collab_id: string;
  sections: LivePaperSection[];
}

export interface LivePaperSummary {
  lp_tool_version: string;
  id: string;
  detail_path: string;
  modified_date: string;
  title: string;
  publication_date: string | null;
  collab_id: string;
  doi: string | null;
  alias: string | null;
  version: string | null;
  authors: Person[];
  abstract: string | null;
}
