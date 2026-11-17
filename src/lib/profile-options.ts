// Choices for the signup and account forms. Values match the API (enum names, ISO codes).

export const GENDERS = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "NonBinary", label: "Non-binary" },
  { value: "PreferNotToSay", label: "Prefer not to say" },
] as const;

export type Gender = (typeof GENDERS)[number]["value"];

// Onboarding step 2, "How will you use BaselineX?". One or more. Values match the API's ProfileRole.
// Self-chosen, so it only personalizes the app; it doesn't unlock coach or business tools.
export const ROLES = [
  {
    value: "ShopAndPlay",
    label: "Shop & play",
    description: "Buy and sell gear, and join sessions near you.",
  },
  {
    value: "Coach",
    label: "Coach",
    description: "Teach private lessons, clinics and camps.",
  },
  {
    value: "Business",
    label: "Business",
    description: "Run a club, academy or pro shop.",
  },
] as const;

export type ProfileRole = (typeof ROLES)[number]["value"];

// Onboarding "Your business" step. Values match the API's OrganizationType.
export const BUSINESS_TYPES = [
  { value: "TennisClub", label: "Tennis club" },
  { value: "PickleballClub", label: "Pickleball club" },
  { value: "ProShop", label: "Pro shop" },
  { value: "Academy", label: "Academy" },
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number]["value"];

// We only serve the United States for now, so the country field is locked to this.
// The API stores the ISO code ("US") and rejects any other country.
export const COUNTRY = { code: "US", name: "United States" } as const;

export const US_STATES: ReadonlyArray<readonly [code: string, name: string]> = [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["DC", "District of Columbia"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
];
