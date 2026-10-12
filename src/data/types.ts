export type Locale = "en" | "uk";

/** Text that differs between the English and Ukrainian versions. */
export type Localized = Record<Locale, string>;

export type PublicationType = "journal" | "conference" | "preprint" | "report" | "dissertation";

export interface Publication {
  id: string;
  /** Original title; never translated. */
  title: string;
  /** Authors in the publisher's order, as initials and family name. */
  authors: string[];
  year: number;
  venue: string;
  /** Volume, issue, article number and pages, as printed by the publisher. */
  details?: string;
  type: PublicationType;
  status: "published" | "preprint";
  doi?: string;
  url?: string;
  pdfUrl?: string;
  codeUrl?: string;
  dataUrl?: string;
  featured?: boolean;
  award?: Localized;
  /** Plain-language description shown for featured entries. */
  summary?: Localized;
}
