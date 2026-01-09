type FAQItem = {
  question: string;
  answer: string;
};

export type ComparisonItem = {
  label: string;
  idriss: string | boolean;
  competitor: string | boolean;
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

  // Optional comparison table
  comparison?: {
    idrissName: string;
    competitorName: string;
    items: ComparisonItem[];
  };

  // FAQ for schema markup + display
  faq: FAQItem[];

  // CTA
  ctaTitle: string;
  ctaButtonText: string;
  ctaButtonHref: string;
};
