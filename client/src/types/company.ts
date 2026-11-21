export type Company = {
  id: string;
  name: string;
  careerPageUrl?: string;
  websiteUrl?: string;
  location?: string;
  notes?: string;
  isFavorite: boolean;
  isArchived: boolean;
  isRedFlagged?: boolean;
  redFlagReason?: string;
};

export type CreateCompanyRequest = {
  name: string;
  location?: string;
  websiteUrl?: string;
  careerPageUrl?: string;
  notes?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  isRedFlagged?: boolean;
  redFlagReason?: string;
};

export type UpdateCompanyRequest = CreateCompanyRequest;
