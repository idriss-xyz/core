import { AnswerPageContent } from '@/components/answer-page';

export const onStreamDonations: AnswerPageContent = {
  slug: 'on-stream-donations',
  title: 'All you need to know about on-stream donations (2026)',
  description:
    'A complete guide to on-stream donations for streamers. Learn about donation tools, fees, chargebacks, and how to maximize your earnings.',
  datePublished: '2026-01-21',
  dateModified: '2026-01-21',

  heroTitle: 'All you need to know about on-stream donations',
  heroSubtitle:
    "Enabling donations on your stream sounds like a simple way to boost your earnings. However, there's more to it than meets the eye.",

  sections: [
    {
      title: 'What are on-stream donations?',
      content: `On-stream donations, often called "tips", are direct monetary gifts from viewers to streamers. Unlike native platform features, these are typically handled by third-party services like Streamlabs or StreamElements. When a viewer donates, an alert usually pops up on the screen with a custom sound or message, providing instant social recognition.

Because they aren't processed through the app store or platform-specific currencies, they are one of the most direct ways for a fan to support your work.`,
    },
    {
      title: 'Should I enable donations or stick to subs and bits?',
      content: `While subscriptions and Bits provide community perks like emotes and badges, they come with a heavy price: a 30% to 50% platform cut. [Direct donations](https://idriss.xyz) are far more efficient for your bottom line, as you keep nearly the entire amount minus a processing fee. Most streamers use both to maximise their earnings.`,
    },
    {
      title: 'What tool should I use?',
      content: `The choice of tool depends on your priorities. Streamlabs and StreamElements are the industry standards for those who want deep integration with overlays and "text-to-speech" alerts, but they primarily rely on PayPal, which is vulnerable to high processing fees and [chargebacks](/guides/streamer-chargebacks).

In contrast, modern onchain solutions like [IDRISS](https://idriss.xyz) move the monetization layer directly onto the blockchain to eliminate these traditional pain points. By utilizing blockchain finality, IDRISS provides 100% protection against chargebacks and account freezes while slashing fees to a flat 1%. Despite the technical shift, streamers still maintain full control over their stream's aesthetic with customizable alerts, leaderboards, and integrated social features.`,
      customTable: {
        headers: ['Feature', 'Streamlabs', 'StreamElements', 'IDRISS'],
        rows: [
          ['Platform fee', '0%', '0%', '1% flat'],
          ['Processor fees', '~6-10%*', '~6-10%*', '$0'],
          ['Effective loss ($10 tip)', 'Up to $0.97', 'Up to $0.97', '$0.10'],
          [
            'Payout speed',
            '1-3 business days',
            '1-3 business days',
            'Instant to your wallet',
          ],
          [
            'Chargeback risk',
            'High ($20 penalty fee)',
            'Moderate (increased protection with SE.Pay)',
            'Zero (Onchain finality)',
          ],
          ['Minimum payout', '$0 (PayPal)', '$0 (PayPal)', '$0'],
        ],
        footnote:
          '*Effective fees on a $10 donation (see [detailed breakdown](/guides/paypal-donation-fees-streamers))',
      },
    },
    {
      title: 'Are crypto donations safe?',
      content: `Crypto donations are increasingly popular in 2026 because they offer a level of security that traditional payment processors cannot match: chargeback finality. In a standard PayPal donation, a "troll" can dispute the charge months later, often sticking the streamer with a $20 fee.

Because blockchain transactions are immutable, once you receive a crypto donation through a tool like IDRISS, it cannot be clawed back. Additionally, these tools often provide better privacy for the streamer, as they don't reveal personal names or email addresses like a standard PayPal account might.`,
    },
  ],

  faq: [
    {
      question: 'Do I need to be a Twitch Affiliate to accept donations?',
      answer:
        'No. Unlike Bits and Subscriptions, which require you to reach Affiliate status, you can add a third-party donation link (like IDRISS or PayPal) to your channel panels from day one.',
    },
    {
      question: 'Can I use donations and subs at once?',
      answer:
        "Yes, and many streamers do. You can use Twitch's native Bits and Subs for community perks while simultaneously providing an IDRISS or PayPal link for direct support. This allows your viewers to choose the method they prefer while giving you a high-efficiency option for maximizing your take-home pay.",
    },
    {
      question: 'Can viewers donate on mobile?',
      answer:
        'Yes, but with a caveat. The Twitch mobile app does not show channel panels by default, so viewers often have to navigate to your "About" section or use a chat command created by your chatbot to find the link.',
    },
    {
      question: 'What is a chargeback?',
      answer:
        'A chargeback is when someone sends a large donation to get a reaction on stream and then disputes the transaction with their bank or PayPal later. This causes the money to be pulled from the streamer\'s account and often results in the streamer being charged an additional $20 "dispute fee".',
    },
  ],

  disclaimer:
    'Note: Fees, payout schedules, and platform policies can change over time. The information in this article reflects standard rates and practices as of the last update of this article. For the most up-to-date details, check the official documentation of each platform.',

  ctaTitle: 'Ready to start accepting donations?',
  ctaButtonText: 'Get Started Free',
  ctaButtonHref: 'https://idriss.xyz',
};
