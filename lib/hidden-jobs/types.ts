export type TipTapDoc = {
  type: string;
  content?: TipTapNode[];
};

export type TipTapNode = {
  type: string;
  text?: string;
  content?: TipTapNode[];
  marks?: { type: string }[];
};

export type HiddenJobCompany = {
  id?: number;
  name?: string;
  logo?: string | null;
  pocName?: string | null;
  pocNumber?: string | null;
  pocEmail?: string | null;
} | null;

export type HiddenJobLocation = {
  id?: number;
  name?: string;
};

export type HiddenJobRole = {
  id?: number;
  name?: string;
};

export type HiddenJobOpening = {
  id: number;
  companyName: string;
  minCTC?: number | null;
  maxCTC?: number | null;
  expirationDateTime?: string | null;
  description?: string | null;
  newDescription?: TipTapDoc | null;
  alertMessage?: string | null;
  yearsOfExperience?: number | null;
  status?: number | null;
  closedReasonType?: number | null;
  closedReason?: string | null;
  offersInternship?: boolean;
  internshipDuration?: number | null;
  internshipStipend?: number | null;
  isProCompany?: boolean;
  category?: string | null;
  domain?: string | null;
  size?: string | null;
  companyPOCEmail?: string | null;
  JobRole?: HiddenJobRole | null;
  JobLocations?: HiddenJobLocation[];
  Company?: HiddenJobCompany;
};

/** Payload for `HiddenJobsClient` — `Company` is remapped to `companyRecord` for reliable RSC→client serialization. */
export type HiddenJobOpeningClient = Omit<HiddenJobOpening, 'Company'> & {
  companyRecord: HiddenJobCompany;
};
