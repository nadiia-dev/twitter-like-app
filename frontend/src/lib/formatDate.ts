import { Timestamp } from "firebase/firestore";

export const formatDate = (rawDate: {
  _seconds: number;
  _nanoseconds: number;
}): string => {
  const timestamp = new Timestamp(rawDate._seconds, rawDate._nanoseconds);
  const dateString = timestamp.toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return dateString;
};

export const formatDateFromString = (rawDate: string): string => {
  const date = new Date(rawDate);
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
