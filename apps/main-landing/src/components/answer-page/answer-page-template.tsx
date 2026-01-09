import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { TopBar, FooterDao } from '@/components';

import { AnswerPageContent, ComparisonItem } from './types';

type Properties = {
  content: AnswerPageContent;
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

const ComparisonTable = ({
  comparison,
}: {
  comparison: NonNullable<AnswerPageContent['comparison']>;
}) => {
  return (
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
  );
};

export const AnswerPageTemplate = ({ content }: Properties) => {
  return (
    <div className="relative flex h-screen">
      <ScrollArea
        type="always"
        className="[&_[data-radix-scroll-area-content]]:w-screen [&_[data-radix-scroll-area-content]]:min-w-[unset_!important]"
      >
        <div className="relative">
          <TopBar />

          <main>
            {/* Hero Section */}
            <header className="relative flex w-full flex-col items-center bg-mint-100 pb-16 pt-[104px] lg:pb-24 lg:pt-[200px]">
              <div className="z-1 flex flex-col items-center gap-4 text-center px-safe md:gap-6">
                <h1 className="container text-balance pb-2 text-display5 font-medium gradient-text md:text-display4 lg:text-display3">
                  {content.heroTitle}
                </h1>
                <p className="container text-body3 text-neutralGreen-700 lg:text-body2">
                  {content.heroSubtitle}
                </p>
                <p className="text-label6 text-neutralGreen-500">
                  Last updated: {content.dateModified}
                </p>
              </div>
            </header>

            {/* Content Sections */}
            <section className="bg-white py-10 lg:py-14">
              <div className="px-safe">
                <div className="container">
                  <div className="mx-auto max-w-[800px]">
                    {content.sections.map((section) => {
                      return (
                        <div key={section.title} className="mb-12 last:mb-0">
                          <h2 className="mb-4 text-heading4 font-medium gradient-text lg:text-heading3">
                            {section.title}
                          </h2>
                          <div className="text-body4 leading-relaxed text-neutralGreen-700 lg:text-body3">
                            {section.content.split('\n\n').map((paragraph) => {
                              return (
                                <p
                                  key={paragraph.slice(0, 50)}
                                  className="mb-4"
                                >
                                  {paragraph}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Comparison Table */}
            {content.comparison && (
              <section className="bg-mint-50 py-10 lg:py-14">
                <div className="px-safe">
                  <div className="container">
                    <div className="mx-auto max-w-[900px]">
                      <h2 className="mb-8 text-center text-heading4 font-medium gradient-text lg:text-heading3">
                        Side-by-Side Comparison
                      </h2>
                      <ComparisonTable comparison={content.comparison} />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* FAQ Section */}
            <section className="bg-white py-10 lg:py-14">
              <div className="px-safe">
                <div className="container">
                  <div className="mx-auto max-w-[800px]">
                    <h2 className="mb-8 text-center text-heading4 font-medium gradient-text lg:text-heading3">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
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
                              {item.answer}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-mint-100 py-10 lg:py-14">
              <div className="px-safe">
                <div className="container flex flex-col items-center text-center">
                  <h2 className="mb-6 text-heading4 font-medium gradient-text lg:text-heading3">
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
            </section>
          </main>

          <FooterDao />
        </div>
      </ScrollArea>
    </div>
  );
};
