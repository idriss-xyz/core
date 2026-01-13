type FAQItem = {
  question: string;
  answer: string;
};

export type ComparisonItem = {
  label: string;
  idriss: string | boolean;
  competitor: string | boolean;
};

type FeeTableRow = {
  label: string;
  idriss: string;
  competitor: string;
};

export type FeeTable = {
  idrissName: string;
  competitorName: string;
  rows: FeeTableRow[];
  footnote?: string;
};

export type AnswerPageContent = {
  // SEO
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Main content sections
  sections: {
    title: string;
    content: string;
  }[];

  // Optional fee breakdown table (inline in content)
  feeTable?: FeeTable;

  // Optional feature comparison table
  comparison?: {
    idrissName: string;
    competitorName: string;
    items: ComparisonItem[];
    footnote?: string;
  };

  // FAQ for schema markup + display
  faq: FAQItem[];

  // Optional disclaimer note
  disclaimer?: string;

  // CTA
  ctaTitle: string;
  ctaButtonText: string;
  ctaButtonHref: string;
};
