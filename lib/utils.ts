import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate Time and return a String value
export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000,
  );

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

// Make number into human readable format ALSO calling this formatAndDivideNumber
export const formatNumber = (value: number): string => {
  if (value === null || value === undefined || isNaN(value)) return "0";

  const absValue = Math.abs(value);

  const units = [
    { suffix: "T", value: 1e12 },
    { suffix: "B", value: 1e9 },
    { suffix: "M", value: 1e6 },
    { suffix: "K", value: 1e3 },
  ];

  for (const unit of units) {
    if (absValue >= unit.value) {
      const formatted = (value / unit.value).toFixed(1).replace(/\.0$/, "");
      return `${formatted}${unit.suffix}`;
    }
  }

  return value.toString();
};

export const getJoinedDate = (date: Date | string): string => {
  // Convert to Date object if it's a string
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const month = dateObj.toLocaleString("default", { month: "long" });
  const year = dateObj.getFullYear();

  return `${month} ${year}`;
};
