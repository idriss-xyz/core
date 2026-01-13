import { AnswerPageContent } from '@/components/answer-page';

export const idrissVsStreamlabs: AnswerPageContent = {
  slug: 'idriss-vs-streamlabs',
  title: 'IDRISS vs Streamlabs (2026): Which Is Better for Streamer Donations?',
  description:
    'Compare IDRISS and Streamlabs for accepting donations as a streamer. See fees, payout speed, chargebacks, and features side-by-side.',
  datePublished: '2026-01-01',
  dateModified: '2026-01-13',

  heroTitle: 'IDRISS vs Streamlabs: Which is better for donations?',
  heroSubtitle:
    'A detailed comparison of two donation platforms for Twitch and YouTube streamers. See how instant payouts and lower fees can help you keep more of what you earn.',

  sections: [
    {
      title: 'Why would you switch from Streamlabs?',
      content: `Streamlabs has been the go-to donation platform for years. It's free, integrates with PayPal, and has a variety of alerts and overlays to choose from.

But PayPal-based donations come with real downsides: [chargebacks that cost you money](/guides/streamer-chargebacks), 1-3 day bank transfer delays, and fees that add up. IDRISS solves these problems by moving payments onto modern blockchain rails.`,
    },
    {
      title: 'How do the fees compare?',
      content: `Streamlabs itself is free, but PayPal takes at least 2.89% plus a fixed fee per transaction, depending on location and currency (see detailed [fee breakdown](https://www.paypal.com/us/webapps/mpp/merchant-fees)). A typical $10 domestic donation within the US costs $0.78 in fees, nearly 8%. For international donations, the total fee can be higher due to international surcharge.

IDRISS charges a flat 1% fee. That same $10 donation costs just $0.10. On $1,000 received in typical $10 donations, you save over $50 compared to PayPal fees. While most crypto platforms force you to pay "gas fees" to move your money, IDRISS actually sponsors the gas fees for your withdrawals. This means you don't have to worry about high network costs eating into your profits when you're ready to cash out.`,
    },
    {
      title: 'Which pays you faster?',
      content: `With Streamlabs and PayPal, your money sits in PayPal until you transfer it to your bank (1-3 business days). It's worth keeping in mind that [discussions on r/Twitch](https://www.reddit.com/r/Twitch/) show that some streamers had issues resolving donation holds.

IDRISS payouts are [instant](/guides/instant-payouts-for-streamers) to your digital wallet. The moment someone donates, the funds are available for you to use, trade, and send. While traditional bank transfers from an exchange still take 1-3 days, many streamers now bypass this entirely by using a [Coinbase Card](https://www.coinbase.com/card) or [Crypto.com Visa](https://crypto.com/en/cards). These cards link directly to your account balance, allowing you to spend your donation at a grocery store or ATM within minutes of receiving it.

Because IDRISS covers the network fees for your withdrawal, you can move your funds to these spendable cards immediately without needing to "top up" your wallet with extra crypto first. You gain total custody and "instant spendability" that traditional platforms can't match.`,
    },
    {
      title: 'What about chargebacks?',
      content: `This is where the difference is dramatic. PayPal [chargebacks](/guides/streamer-chargebacks) are a major problem for streamers. Donors can dispute transactions months later, taking back the money plus a $20 fee.

With IDRISS, donations are final and cannot be charged back, as they are processed on modern blockchain payment rails. This completely eliminates chargeback fraud.`,
    },
    {
      title: 'Can you use both platforms?',
      content: `Yes. IDRISS works alongside your existing setup. You can keep Streamlabs for viewers who prefer PayPal while adding IDRISS as another option.

Adding IDRISS takes about 5 minutes. Your existing Streamlabs alerts and overlays continue working separately.`,
    },
  ],

  feeTable: {
    idrissName: 'IDRISS',
    competitorName: 'Streamlabs',
    rows: [
      { label: 'Donation', idriss: '$10', competitor: '$10' },
      { label: 'Base fee', idriss: '-$0.10', competitor: '-$0.289' },
      { label: 'Fixed fee', idriss: '-$0', competitor: '-$0.49' },
      { label: 'Intl. fee', idriss: '-$0', competitor: '-$0.15' },
      { label: 'You receive', idriss: '$9.90', competitor: '$9.07' },
    ],
    footnote:
      'Estimate based on fees for an international donation in USD to the US via PayPal.',
  },

  comparison: {
    idrissName: 'IDRISS',
    competitorName: 'Streamlabs',
    items: [
      {
        label: 'Total fees',
        idriss: '1%',
        competitor: '~6-10%*',
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
    ],
    footnote: '*Effective fee on a typical donation of $10',
  },

  faq: [
    {
      question: 'Is IDRISS free to use?',
      answer:
        'Creating an account and setting up donations is completely free. IDRISS takes a fixed 1% fee on donations, which is significantly lower than PayPal or credit card processing fees.',
    },
    {
      question: 'How do I access my earnings?',
      answer:
        'Your earnings are available instantly after each donation. You can withdraw to your bank account via an exchange, or keep funds in your IDRISS wallet for future use. Since withdrawal network fees are sponsored, you can withdraw any amount at any time without waiting for "low network fee" hours.',
    },
    {
      question: 'Will my Streamlabs alerts still work?',
      answer:
        'Yes. IDRISS has its own alerts that you add as a separate browser source in OBS. Your Streamlabs alerts continue working for Streamlabs donations.',
    },
    {
      question: 'Is IDRISS harder to set up than Streamlabs?',
      answer:
        'No. Both platforms use Twitch as the login method, and IDRISS setup is similar to Streamlabs: create an account, customize your page, and add a browser source to OBS. IDRISS will set up your wallet for you, while Streamlabs will ask you to connect your PayPal.',
    },
    {
      question: 'What payment methods do viewers have with IDRISS?',
      answer:
        'Viewers currently support streamers on IDRISS using cryptocurrency based payments. Donations are sent onchain and settle instantly, without chargebacks or payout delays. Viewers need access to a compatible crypto wallet to complete a donation. The specific networks and tokens supported depend on the streamer\'s setup. While this is still a barrier for some, it is the only way to provide the "no-chargeback" security that protects your income.',
    },
  ],

  disclaimer:
    'Note: Fees, payout schedules, and platform policies can change over time. The information in this article reflects standard rates and practices as of the last update of this article. For the most up-to-date details, check the official documentation of each platform.',

  ctaTitle: 'Ready to keep more of your donations?',
  ctaButtonText: 'Get Started Free',
  ctaButtonHref: 'https://idriss.xyz',
};
