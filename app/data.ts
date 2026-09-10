export const siteUrl = "https://ukplaces.co.uk";

export const sources = [
  {
    key: "elections",
    name: "UK Elections",
    topic: "Election results and representation",
    href: "https://ukelections.co.uk/seats/burnley/",
    logo: "/brands/ukelections.svg",
    theme: "elections",
  },
  {
    key: "demographics",
    name: "UK Demographics",
    topic: "Population, crime and local context",
    href: "https://ukdemographics.co.uk/places/burnley/",
    logo: "/brands/ukdemographics.svg",
    theme: "demographics",
  },
  {
    key: "doge",
    name: "AI DOGE",
    topic: "Published council payment records",
    href: "https://aidoge.co.uk/councils/burnley/",
    logo: "/brands/aidoge.svg",
    theme: "doge",
  },
  {
    key: "asylum",
    name: "Asylum Stats",
    topic: "Home Office asylum support data",
    href: "https://asylumstats.co.uk/places/burnley/",
    logo: "/brands/asylumstats.svg",
    theme: "asylum",
  },
] as const;

export const publishedPlaces = [
  {
    slug: "burnley",
    name: "Burnley",
    label: "Burnley local authority area",
    region: "Lancashire · North West England",
    boundary: "Local authority area",
    href: "/places/burnley/",
    aliases: ["burnley", "burnley borough", "burnley council"],
    coverage: ["Representation", "Recorded crime", "Council payments", "Asylum support"],
    profileReviewed: "10 September 2026",
  },
] as const;

export const burnley = {
  name: "Burnley",
  region: "Lancashire · North West England",
  profileReviewed: "10 September 2026",
  description:
    "A source-led view of Burnley’s council representation, recorded crime, published council payments and asylum support.",
  topics: [
    {
      id: "representation",
      number: "01",
      theme: "elections",
      source: "UK Elections",
      label: "Council representation",
      value: "11 / 45",
      valueLabel: "Reform UK seats",
      dataDate: "7 May 2026",
      headline: "No party has overall control of Burnley Council.",
      summary:
        "Reform holds 11 of the council’s 45 seats. A majority requires 23 seats, so no single party can control the council alone.",
      metrics: [
        ["Reform seats", "11"],
        ["Council seats", "45"],
        ["For a majority", "23"],
        ["Election", "7 May 2026"],
      ],
      definition:
        "This is the composition after the May 2026 borough election. It shows seats held, not how a minority administration or voting arrangements operate day to day.",
      href: "https://ukelections.co.uk/seats/burnley/",
    },
    {
      id: "crime",
      number: "02",
      theme: "demographics",
      source: "UK Demographics",
      label: "Recorded crime",
      value: "107.4",
      valueLabel: "recorded crimes per 1,000 residents",
      dataDate: "Year ending March 2024",
      headline: "Recorded crime fell 3.7% over the year.",
      summary:
        "The all-crime rate was 107.4 per 1,000 residents. Violent crime, theft and anti-social behaviour are shown separately because one total can hide very different local patterns.",
      metrics: [
        ["Total crime", "107.4"],
        ["Violent crime", "43.1"],
        ["Theft", "35.3"],
        ["Anti-social behaviour", "45.7"],
      ],
      definition:
        "These are police-recorded incidents per 1,000 residents. They are useful for comparison, but changes in reporting and recording practices can affect the totals.",
      href: "https://ukdemographics.co.uk/places/burnley/",
    },
    {
      id: "payments",
      number: "03",
      theme: "doge",
      source: "AI DOGE",
      label: "Published council payments",
      value: "£38.1m",
      valueLabel: "published payments in 2025/26",
      dataDate: "Refreshed 6 September 2026",
      headline: "4,489 published payments over £500 are in the record.",
      summary:
        "The 2025/26 transparency record names 843 suppliers. It is a way to inspect published payments, suppliers and original files—not a measure of the council’s whole budget.",
      metrics: [
        ["Published payments", "£38.1m"],
        ["Payments over £500", "4,489"],
        ["Suppliers", "843"],
        ["Period", "2025/26"],
      ],
      definition:
        "Councils publish payment records under transparency rules. They exclude categories that are not in those files, so they should not be treated as total spending or a complete supplier ledger.",
      href: "https://aidoge.co.uk/councils/burnley/",
    },
    {
      id: "asylum-support",
      number: "04",
      theme: "asylum",
      source: "Asylum Stats",
      label: "Asylum support",
      value: "471",
      valueLabel: "people receiving asylum support",
      dataDate: "30 June 2026",
      headline: "466 people were in dispersal accommodation.",
      summary:
        "The Home Office snapshot records 471 people receiving asylum support in Burnley: 46.66 per 10,000 residents. This separates local support data from broader migration or population measures.",
      metrics: [
        ["On asylum support", "471"],
        ["Per 10,000 residents", "46.66"],
        ["Dispersal accommodation", "466"],
        ["Data date", "30 Jun 2026"],
      ],
      definition:
        "The measure covers people recorded in the Home Office asylum support system. It is not a count of every migrant, refugee or foreign-born resident in the borough.",
      href: "https://asylumstats.co.uk/places/burnley/",
    },
  ],
} as const;

export const burnleyStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/places/burnley/#webpage`,
      url: `${siteUrl}/places/burnley/`,
      name: "Burnley local data: elections, crime, payments and asylum support",
      description: burnley.description,
      inLanguage: "en-GB",
      dateModified: "2026-09-10",
      isPartOf: { "@id": `${siteUrl}/#website` },
      mainEntity: { "@id": `${siteUrl}/places/burnley/#place` },
    },
    {
      "@type": "AdministrativeArea",
      "@id": `${siteUrl}/places/burnley/#place`,
      name: "Burnley",
      description: "Burnley local authority area in Lancashire, North West England.",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Lancashire",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "UK Places", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Places", item: `${siteUrl}/#places` },
        { "@type": "ListItem", position: 3, name: "Burnley", item: `${siteUrl}/places/burnley/` },
      ],
    },
  ],
};
