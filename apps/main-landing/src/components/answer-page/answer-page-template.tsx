import Link from 'next/link';
import { ReactNode } from 'react';
import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { TopBar } from '@/app/components/top-bar';
import { Footer } from '@/app/components/footer';

import {
  AnswerPageContent,
  ComparisonItem,
  FeeTable,
  CustomTable,
} from './types';

type Properties = {
  content: AnswerPageContent;
};

const parseMarkdownLinks = (text: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const linkRegex = /\[([^\]]+)]\(([^)]+)\)/;
  const boldRegex = /\*\*([^*]+)\*\*/;

  while (remaining.length > 0) {
    const linkMatch = linkRegex.exec(remaining);
    const boldMatch = boldRegex.exec(remaining);

    const linkIndex = linkMatch ? linkMatch.index : -1;
    const boldIndex = boldMatch ? boldMatch.index : -1;

    if (linkIndex === -1 && boldIndex === -1) {
      parts.push(remaining);
      break;
    }

    const nextMatch =
      linkIndex !== -1 && (boldIndex === -1 || linkIndex < boldIndex)
        ? { type: 'link' as const, index: linkIndex, match: linkMatch }
        : { type: 'bold' as const, index: boldIndex, match: boldMatch };

    if (nextMatch.index > 0) {
      parts.push(remaining.slice(0, nextMatch.index));
    }

    if (nextMatch.type === 'link' && linkMatch) {
      const linkText = linkMatch[1] ?? '';
      const url = linkMatch[2] ?? '';
      const isExternal = url.startsWith('http');
      const isReddit = url.includes('reddit.com');

      parts.push(
        isExternal ? (
          <a
            key={key++}
            href={url}
            target="_blank"
            rel={
              isReddit
                ? 'nofollow ugc noopener noreferrer'
                : 'nofollow noopener noreferrer'
            }
            className="text-mint-600 underline"
          >
            {linkText}
          </a>
        ) : (
          <Link key={key++} href={url} className="text-mint-600 underline">
            {linkText}
          </Link>
        ),
      );
      remaining = remaining.slice(nextMatch.index + linkMatch[0].length);
    } else if (nextMatch.type === 'bold' && boldMatch) {
      const boldContent = boldMatch[1] ?? '';
      // Recursively parse the content inside bold tags to handle nested links
      parts.push(
        <strong key={key++} className="font-semibold">
          {parseMarkdownLinks(boldContent)}
        </strong>,
      );
      remaining = remaining.slice(nextMatch.index + boldMatch[0].length);
    }
  }

  return parts.length > 0 ? parts : [text];
};

const ComparisonCell = ({ value }: { value: string | boolean }) => {
  if (typeof value === 'boolean') {
    return value ? (
      <Icon name="Check" size={20} className="text-mint-600" />
    ) : (
      <Icon name="X" size={20} className="text-red-500" />
    );
  }
  return <span>{value}</span>;
};

const CustomTableComponent = ({
  customTable,
}: {
  customTable: CustomTable;
}) => {
  return (
    <div className="my-6">
      {customTable.title && (
        <h3 className="mb-4 text-center text-heading5 font-medium text-neutralGreen-900">
          {customTable.title}
        </h3>
      )}
      <div className="relative overflow-hidden rounded-[24px] bg-white/80 backdrop-blur-[7px]">
        <GradientBorder borderRadius={24} gradientDirection="toTop" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-mint-200">
                {customTable.headers.map((header, index) => {
                  return (
                    <th
                      key={index}
                      className={`px-6 py-4 ${index === 0 ? 'text-left' : 'text-center'} text-label4 font-medium text-neutralGreen-900`}
                    >
                      {header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {customTable.rows.map((row, rowIndex) => {
                return (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? 'bg-mint-50/50' : ''}
                  >
                    {row.map((cell, cellIndex) => {
                      return (
                        <td
                          key={cellIndex}
                          className={`px-6 py-4 ${cellIndex === 0 ? 'text-left' : 'text-center'} text-body5 text-neutralGreen-900`}
                        >
                          {parseMarkdownLinks(cell)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {customTable.footnote && (
        <p className="mt-3 text-body6 italic text-neutralGreen-500">
          {parseMarkdownLinks(customTable.footnote)}
        </p>
      )}
    </div>
  );
};

const FeeComparisonTable = ({ feeTable }: { feeTable: FeeTable }) => {
  return (
    <div className="my-6">
      <div className="relative overflow-hidden rounded-[24px] bg-white/80 backdrop-blur-[7px]">
        <GradientBorder borderRadius={24} gradientDirection="toTop" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-mint-200">
                <th className="px-6 py-4 text-left text-label4 font-medium text-neutralGreen-900" />
                <th className="px-6 py-4 text-center text-label4 font-medium text-mint-600">
                  {feeTable.idrissName}
                </th>
                <th className="px-6 py-4 text-center text-label4 font-medium text-neutralGreen-700">
                  {feeTable.competitorName}
                </th>
              </tr>
            </thead>
            <tbody>
              {feeTable.rows.map((row, index) => {
                return (
                  <tr
                    key={row.label}
                    className={index % 2 === 0 ? 'bg-mint-50/50' : ''}
                  >
                    <td className="px-6 py-4 text-body5 text-neutralGreen-900">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 text-center text-body5">
                      {row.idriss}
                    </td>
                    <td className="px-6 py-4 text-center text-body5">
                      {row.competitor}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {feeTable.footnote && (
        <p className="mt-3 text-body6 italic text-neutralGreen-500">
          {feeTable.footnote}
        </p>
      )}
    </div>
  );
};

const ComparisonTable = ({
  comparison,
}: {
  comparison: NonNullable<AnswerPageContent['comparison']>;
}) => {
  return (
    <div>
      <div className="relative overflow-hidden rounded-[24px] bg-white/80 backdrop-blur-[7px]">
        <GradientBorder borderRadius={24} gradientDirection="toTop" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-mint-200">
                <th className="px-6 py-4 text-left text-label4 font-medium text-neutralGreen-900">
                  Feature
                </th>
                <th className="px-6 py-4 text-center text-label4 font-medium text-mint-600">
                  {comparison.idrissName}
                </th>
                <th className="px-6 py-4 text-center text-label4 font-medium text-neutralGreen-700">
                  {comparison.competitorName}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.items.map((item: ComparisonItem, index: number) => {
                return (
                  <tr
                    key={item.label}
                    className={index % 2 === 0 ? 'bg-mint-50/50' : ''}
                  >
                    <td className="px-6 py-4 text-body5 text-neutralGreen-900">
                      {item.label}
                    </td>
                    <td className="px-6 py-4 text-center text-body5">
                      <div className="flex justify-center">
                        <ComparisonCell value={item.idriss} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-body5">
                      <div className="flex justify-center">
                        <ComparisonCell value={item.competitor} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {comparison.footnote && (
        <p className="mt-3 text-body6 italic text-neutralGreen-500">
          {parseMarkdownLinks(comparison.footnote)}
        </p>
      )}
    </div>
  );
};

export const AnswerPageTemplate = ({ content }: Properties) => {
  return (
    <div className="relative flex h-screen">
      <ScrollArea
        type="always"
        customScrollEventName="creatorsLandingPageScroll"
        className="[&_[data-radix-scroll-area-content]]:w-screen [&_[data-radix-scroll-area-content]]:min-w-[unset_!important]"
      >
        <div className="relative">
          <TopBar isLanding displayCTA hideNavigation />

          <main>
            {/* Hero Section */}
            <header className="relative flex w-full flex-col items-center bg-mint-100 pb-16 pt-[104px] lg:pb-24 lg:pt-[200px]">
              <div className="z-1 flex flex-col items-center gap-4 text-center px-safe md:gap-6">
                <h1 className="container text-balance pb-2 text-display5 font-medium uppercase gradient-text md:text-display4 lg:text-display3">
                  {content.heroTitle}
                </h1>
                <div className="container">
                  <div className="mx-auto max-w-[800px]">
                    <p className="text-body3 text-neutralGreen-700 lg:text-body2">
                      {parseMarkdownLinks(content.heroSubtitle)}
                    </p>
                  </div>
                </div>
                <p className="text-label6 text-neutralGreen-500">
                  Last updated: {content.dateModified}
                </p>
              </div>
            </header>

            {/* Content Sections */}
            <section className="bg-white pb-12 pt-10 lg:pt-14">
              <div className="px-safe">
                <div className="container">
                  <div className="mx-auto max-w-[800px]">
                    {content.sections.map((section) => {
                      const isFeeSection = section.title
                        .toLowerCase()
                        .includes('fee');
                      return (
                        <div key={section.title} className="mb-12 last:mb-0">
                          <h2 className="mb-4 text-heading4 font-medium text-neutralGreen-900 lg:text-heading3">
                            {section.title}
                          </h2>
                          <div className="text-body4 leading-relaxed text-neutralGreen-700 lg:text-body3">
                            {(() => {
                              const paragraphs = section.content.split('\n\n');
                              const result: ReactNode[] = [];
                              let numberedListItems: string[] = [];
                              let listKey = 0;

                              for (const [
                                pIndex,
                                paragraph,
                              ] of paragraphs.entries()) {
                                const trimmed = paragraph.trim();
                                const isNumberedItem = /^\d+\.\s/.test(trimmed);

                                if (isNumberedItem) {
                                  // Accumulate numbered items
                                  numberedListItems.push(trimmed);
                                } else {
                                  // If we have accumulated numbered items, render them first
                                  if (numberedListItems.length > 0) {
                                    result.push(
                                      <ol
                                        key={`list-${listKey++}`}
                                        className="mb-4 list-decimal space-y-2 pl-6"
                                      >
                                        {numberedListItems.map(
                                          (item, index) => {
                                            const match =
                                              /^(\d+)\.\s*(.*)$/.exec(item);
                                            if (match) {
                                              const content = match[2] ?? '';
                                              return (
                                                <li
                                                  key={index}
                                                  className="pl-2"
                                                >
                                                  {parseMarkdownLinks(content)}
                                                </li>
                                              );
                                            }
                                            return null;
                                          },
                                        )}
                                      </ol>,
                                    );
                                    numberedListItems = [];
                                  }

                                  // Now process the current paragraph
                                  const lines = paragraph.split('\n');
                                  const isBulletList = lines.some((line) => {
                                    return line.trim().startsWith('-');
                                  });

                                  if (isBulletList) {
                                    result.push(
                                      <ul
                                        key={paragraph.slice(0, 50)}
                                        className="mb-4 list-disc space-y-2 pl-6"
                                      >
                                        {lines.map((line, index) => {
                                          const trimmedLine = line.trim();
                                          const isNested =
                                            line.startsWith('  -');

                                          if (trimmedLine.startsWith('-')) {
                                            const content = trimmedLine
                                              .slice(1)
                                              .trim();
                                            return (
                                              <li
                                                key={index}
                                                className={`pl-2 ${isNested ? 'ml-6 list-[circle]' : ''}`}
                                              >
                                                {parseMarkdownLinks(content)}
                                              </li>
                                            );
                                          }
                                          return null;
                                        })}
                                      </ul>,
                                    );
                                  } else {
                                    result.push(
                                      <p
                                        key={paragraph.slice(0, 50)}
                                        className="mb-4"
                                      >
                                        {parseMarkdownLinks(paragraph)}
                                      </p>,
                                    );
                                  }
                                }

                                // If this is the last paragraph and we have numbered items, render them
                                if (
                                  pIndex === paragraphs.length - 1 &&
                                  numberedListItems.length > 0
                                ) {
                                  result.push(
                                    <ol
                                      key={`list-${listKey++}`}
                                      className="mb-4 list-decimal space-y-2 pl-6"
                                    >
                                      {numberedListItems.map((item, index) => {
                                        const match = /^(\d+)\.\s*(.*)$/.exec(
                                          item,
                                        );
                                        if (match) {
                                          const content = match[2] ?? '';
                                          return (
                                            <li key={index} className="pl-2">
                                              {parseMarkdownLinks(content)}
                                            </li>
                                          );
                                        }
                                        return null;
                                      })}
                                    </ol>,
                                  );
                                }
                              }

                              return result;
                            })()}
                          </div>
                          {section.footnote && (
                            <p className="mt-2 text-body6 italic text-neutralGreen-500">
                              {parseMarkdownLinks(section.footnote)}
                            </p>
                          )}
                          {isFeeSection && content.feeTable && (
                            <FeeComparisonTable feeTable={content.feeTable} />
                          )}
                          {section.customTable && (
                            <CustomTableComponent
                              customTable={section.customTable}
                            />
                          )}
                          {section.afterTable &&
                            (() => {
                              const afterTableText = section.afterTable;
                              return (
                                <div className="text-body4 leading-relaxed text-neutralGreen-700 lg:text-body3">
                                  {afterTableText
                                    .split('\n\n')
                                    .map((paragraph, index) => {
                                      return (
                                        <p key={index} className="mb-4">
                                          {parseMarkdownLinks(paragraph)}
                                        </p>
                                      );
                                    })}
                                </div>
                              );
                            })()}
                        </div>
                      );
                    })}
                    {content.customTable && (
                      <CustomTableComponent customTable={content.customTable} />
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Comparison Table */}
            {content.comparison && (
              <section className="bg-mint-50 pb-12">
                <div className="px-safe">
                  <div className="container">
                    <div className="mx-auto max-w-[800px]">
                      <ComparisonTable comparison={content.comparison} />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* FAQ Section */}
            <section className="bg-white pb-12">
              <div className="px-safe">
                <div className="container">
                  <div className="mx-auto max-w-[800px]">
                    <h2 className="mb-4 text-heading4 font-medium text-neutralGreen-900 lg:text-heading3">
                      Frequently asked questions
                    </h2>
                    <div>
                      {content.faq.map((item) => {
                        return (
                          <div
                            key={item.question}
                            className="bg-mint-50 relative rounded-[16px] p-6"
                          >
                            <h3 className="mb-3 text-heading6 font-medium text-neutralGreen-900">
                              {item.question}
                            </h3>
                            <p className="text-body5 text-neutralGreen-700">
                              {parseMarkdownLinks(item.answer)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            {content.disclaimer && (
              <section className="bg-mint-50 py-6 lg:py-8">
                <div className="px-safe">
                  <div className="container">
                    <div className="mx-auto max-w-[800px]">
                      <p className="text-body6 italic text-neutralGreen-500">
                        {content.disclaimer}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* CTA Section */}
            <section className="bg-mint-100 py-10 lg:py-14">
              <div className="px-safe">
                <div className="container">
                  <div className="mx-auto flex max-w-[800px] flex-col items-center text-center">
                    <h2 className="mb-6 text-heading4 font-medium uppercase gradient-text lg:text-heading3">
                      {content.ctaTitle}
                    </h2>
                    <Button
                      intent="primary"
                      size="large"
                      asLink
                      href={content.ctaButtonHref}
                    >
                      {content.ctaButtonText}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </ScrollArea>
    </div>
  );
};
