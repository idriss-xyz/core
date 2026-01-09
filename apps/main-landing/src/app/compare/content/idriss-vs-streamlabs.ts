import { AnswerPageContent } from '@/components/answer-page';

export const idrissVsStreamlabs: AnswerPageContent = {
  slug: 'idriss-vs-streamlabs',
  title: 'IDRISS vs Streamlabs (2026): Which Is Better for Streamer Donations?',
  description:
    'Compare IDRISS and Streamlabs for accepting donations as a streamer. See fees, payout speed, chargebacks, and features side-by-side.',
  datePublished: '2026-01-01',
  dateModified: '2026-01-09',

  heroTitle: 'IDRISS vs Streamlabs: Which Is Better for Donations?',
  heroSubtitle:
    'A detailed comparison of two donation platforms for Twitch and YouTube streamers. See how instant payouts and lower fees can help you keep more of what you earn.',

  sections: [
    {
      title: 'Why Would You Switch from Streamlabs?',
      content: `Streamlabs has been the go-to donation platform for years. It's free, integrates with PayPal, and has great alerts and overlays.

But PayPal-based donations come with real downsides: [chargebacks that cost you money](/guides/streamer-chargebacks), 1-3 day bank transfer delays, and fees that add up. IDRISS solves these problems.`,
    },
    {
      title: 'How Do the Fees Compare?',
      content: `Streamlabs itself is free, but [PayPal takes 2.9% + $0.30](https://www.paypal.com/us/webapps/mpp/merchant-fees) per transaction. A $10 donation costs $0.59 in fees - nearly 6%.

IDRISS charges a flat 1% fee. That same $10 donation costs just $0.10. On $1,000 in donations, you save over $50 compared to PayPal fees.`,
    },
    {
      title: 'Which Pays You Faster?',
      content: `With Streamlabs and PayPal, your money sits in PayPal until you transfer it to your bank (1-3 business days). Some streamers report account holds lasting weeks.

IDRISS payouts are [instant](/guides/instant-payouts-for-streamers). The moment someone donates, the funds are available. No waiting periods, no minimum thresholds, no account holds.`,
    },
    {
      title: 'What About Chargebacks?',
      content: `This is where the difference is dramatic. PayPal chargebacks are a [major problem for streamers](/guides/streamer-chargebacks). Donors can dispute transactions months later, taking back the money plus a $20 fee.

With IDRISS, donations are final and cannot be charged back. This completely eliminates chargeback fraud.`,
    },
    {
      title: 'Can You Use Both Platforms?',
      content: `Yes. IDRISS works alongside your existing setup. You can keep Streamlabs for viewers who prefer PayPal while adding IDRISS as another option.

Adding IDRISS takes about 5 minutes. Your existing Streamlabs alerts and overlays continue working separately.`,
    },
  ],

  comparison: {
    idrissName: 'IDRISS',
    competitorName: 'Streamlabs',
    items: [
      {
        label: 'Total fees',
        idriss: '1%',
        competitor: '2.9% + $0.30 (PayPal)',
      },
      {
        label: 'Payout speed',
        idriss: 'Instant',
        competitor: '1-3 business days',
      },
      {
        label: 'Chargeback protection',
        idriss: true,
        competitor: false,
      },
      {
        label: 'Minimum payout threshold',
        idriss: 'None',
        competitor: '$100 for some methods',
      },
      {
        label: 'On-stream alerts',
        idriss: true,
        competitor: true,
      },
      {
        label: 'Text-to-speech',
        idriss: true,
        competitor: true,
      },
      {
        label: 'Works with OBS',
        idriss: true,
        competitor: true,
      },
      {
        label: 'Accepts credit cards',
        idriss: false,
        competitor: true,
      },
    ],
  },

  faq: [
    {
      question: 'Is IDRISS free to use?',
      answer:
        'Creating an account and setting up donations is completely free. IDRISS takes a 1% fee on donations, which is significantly lower than PayPal or credit card processing fees.',
    },
    {
      question: 'How do I access my earnings?',
      answer:
        'Your earnings are available instantly after each donation. You can withdraw to your bank account or keep funds in your IDRISS wallet for future use.',
    },
    {
      question: 'Will my Streamlabs alerts still work?',
      answer:
        'Yes. IDRISS has its own alert system that you add as a separate browser source in OBS. Your Streamlabs alerts continue working for Streamlabs donations.',
    },
    {
      question: 'Is IDRISS harder to set up than Streamlabs?',
      answer:
        'No. IDRISS setup takes about 5 minutes - create an account, customize your page, and add a browser source to OBS. Both platforms are beginner-friendly.',
    },
    {
      question: 'What payment methods do viewers have with IDRISS?',
      answer:
        'Viewers can pay with various methods through IDRISS. The checkout experience is simple and familiar.',
    },
  ],

  ctaTitle: 'Ready to Keep More of Your Donations?',
  ctaButtonText: 'Get Started Free',
  ctaButtonHref: 'https://creators.idriss.xyz',
};
