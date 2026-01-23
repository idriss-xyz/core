import { AnswerPageContent } from '@/components/answer-page';

export const paypalDonationFeesStreamers: AnswerPageContent = {
  slug: 'paypal-donation-fees-streamers',
  title: 'PayPal donation fees for streamers (2026)',
  description:
    "A detailed breakdown of PayPal's fee system for streamers. Explore how much you really earn from your on-stream donations, and what alternatives you might have.",
  datePublished: '2026-01-20',
  dateModified: '2026-01-20',

  heroTitle: 'PayPal donation fees for streamers (2026)',
  heroSubtitle:
    "A detailed breakdown of PayPal's fee system for streamers. Explore how much you really earn from your on-stream donations, and what alternatives you might have.",

  sections: [
    {
      title: 'How much does PayPal take from my donations?',
      content: `For every donation, PayPal takes at least 2.89% + a fixed fee, depending on location and currency. A typical $10 domestic donation within the US costs $0.78 in fees, which is nearly 8%. For international donations, the total fee can be higher due to [international surcharge](https://www.paypal.com/us/business/paypal-business-fees).

See the detailed breakdown for domestic donations within the US:`,
      customTable: {
        headers: [
          'Donation Amount',
          'PayPal Fees',
          'You Receive',
          'Effective Loss',
        ],
        rows: [
          ['$1.00', '$0.52', '$0.48', '52%'],
          ['$5.00', '$0.63', '$4.37', '12.6%'],
          ['$10.00', '$0.78', '$9.22', '7.8%'],
          ['$20.00', '$1.07', '$18.93', '5.3%'],
          ['$100.00', '$3.38', '$96.62', '3.4%'],
        ],
      },
    },
    {
      title: 'Are there any hidden costs?',
      content: `The percentage cut is only one part of the friction. PayPal's traditional "merchant" model introduces other risks:

- **Chargeback fees**: If a donor disputes a payment, PayPal typically charges the streamer a non-refundable fee of $20 per incident in the US. See more about [chargebacks](/guides/streamer-chargebacks).
- **Payout delays**: Funds sit in your PayPal account until you transfer them to your bank, which typically takes 1-3 business days.
- **Frozen accounts**: Many streamers have [reported issues with donation holds](https://www.reddit.com/r/Twitch/comments/7gbbbx/paypal_and_large_donations_or_freezing_your/) or frozen accounts while trying to resolve disputes.`,
    },
    {
      title: 'How does IDRISS compare?',
      content: `[IDRISS](https://idriss.xyz) was built to provide a better way to monetize than legacy banking "middlemen" that cause high fees and delays. By moving the monetization layer onchain, we replace 1990s payment rails with modern settlement. This minimizes fees, and removes the risk of chargebacks or account freezes.`,
    },
  ],
  comparison: {
    idrissName: 'IDRISS',
    competitorName: 'PayPal',
    items: [
      {
        label: 'Total Fees',
        idriss: '1%',
        competitor: '~6-10%*',
      },
      {
        label: 'Payout Speed',
        idriss: 'Instant to a wallet',
        competitor: '1-3 business days',
      },
      {
        label: 'Chargeback Protection',
        idriss: '100% (Finality)',
        competitor: 'Low',
      },
    ],
    footnote:
      '*Effective fee on a $10 donation (see [detailed breakdown](#how-much-does-paypal-take-from-my-donations)).',
  },

  faq: [
    {
      question: 'Can I stop chargebacks on PayPal?',
      answer:
        'Not entirely. While PayPal offers a "Chargeback Protection Tool" for business accounts, it typically only covers unauthorized or "item not received" claims and requires you to submit proof of delivery to have fees waived.',
    },
    {
      question: 'Is there a special "Friends and Family" rate for streamers?',
      answer:
        'While "Friends and Family" has no fees for the recipient when sent via balance or bank, using it for business (streaming) is a violation of PayPal\'s User Agreement. If caught, PayPal can limit your account or seize funds.',
    },
    {
      question: 'Is there a better way to receive donations?',
      answer:
        'While PayPal is the industry standard for many, a growing number of streamers are [moving their monetization onchain](https://idriss.xyz) to eliminate high fees and chargeback risks.',
    },
  ],

  disclaimer:
    'Note: Fees, payout schedules, and platform policies can change over time. The information in this article reflects standard rates and practices as of the last update of this article. For the most up-to-date details, check the official documentation of each platform.',

  ctaTitle: 'Ready to reduce your donation fees?',
  ctaButtonText: 'Get Started Free',
  ctaButtonHref: 'https://idriss.xyz',
};
