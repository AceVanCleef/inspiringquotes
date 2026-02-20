export const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
  MOST_POPULAR: "most-popular",
  LEAST_POPULAR: "least-popular",
  ALPHA_ASC: "alpha-asc",
  ALPHA_DESC: "alpha-desc",
  DEFAULT: "default",
} as const;

// Union type
export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

export const sortSelectOptions: { value: SortOption; label: string }[] = [
  { value: SORT_OPTIONS.DEFAULT, label: "-" },
  { value: SORT_OPTIONS.NEWEST, label: "Recent" },
  { value: SORT_OPTIONS.OLDEST, label: "Oldest" },
  { value: SORT_OPTIONS.MOST_POPULAR, label: "Most Popular (Likes)" },
  { value: SORT_OPTIONS.LEAST_POPULAR, label: "Secret Tips (Few Likes)" },
  { value: SORT_OPTIONS.ALPHA_ASC, label: "Alphabetical (A-Z)" },
  { value: SORT_OPTIONS.ALPHA_DESC, label: "Alphabetical (Z-A)" },
];

export const sortAuthorSelectOptions: { value: SortOption; label: string }[] = [
  { value: SORT_OPTIONS.DEFAULT, label: "-" },
  { value: SORT_OPTIONS.ALPHA_ASC, label: "Alphabetical (A-Z)" },
  { value: SORT_OPTIONS.ALPHA_DESC, label: "Alphabetical (Z-A)" },
];