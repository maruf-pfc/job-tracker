import { format } from "date-fns";

export const formatDateString = (dateString: Date | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const formattedDate = format(date, "MMMM do yyyy, h:mma");
  return formattedDate;
};

export const slugifySentences = (sentence: string): string => {
  return sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};
