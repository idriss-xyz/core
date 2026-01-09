import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AnswerPageTemplate } from '@/components/answer-page';

import { guidePages, getAllGuideSlugs } from '../content';

type Properties = {
  params: Promise<{ slug: string }>;
};

// ts-unused-exports:disable-next-line
export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => {
    return { slug };
  });
}

// ts-unused-exports:disable-next-line
export async function generateMetadata({
  params,
}: Properties): Promise<Metadata> {
  const { slug } = await params;
  const content = guidePages[slug];

  if (!content) {
    return { robots: { index: false, follow: false } };
  }

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      type: 'article',
      publishedTime: content.datePublished,
      modifiedTime: content.dateModified,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
    },
  };
}

// ts-unused-exports:disable-next-line
export default async function GuidePage({ params }: Properties) {
  const { slug } = await params;
  const content = guidePages[slug];

  if (!content) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `https://idriss.xyz/guides/${slug}#article`,
        'headline': content.title,
        'description': content.description,
        'datePublished': content.datePublished,
        'dateModified': content.dateModified,
        'author': {
          '@type': 'Organization',
          '@id': 'https://idriss.xyz/#organization',
        },
        'publisher': {
          '@type': 'Organization',
          '@id': 'https://idriss.xyz/#organization',
        },
        'isPartOf': { '@id': 'https://idriss.xyz/#website' },
        'mainEntityOfPage': `https://idriss.xyz/guides/${slug}`,
      },
      {
        '@type': 'FAQPage',
        '@id': `https://idriss.xyz/guides/${slug}#faq`,
        'mainEntity': content.faq.map((item) => {
          return {
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': item.answer,
            },
          };
        }),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnswerPageTemplate content={content} />
    </>
  );
}
