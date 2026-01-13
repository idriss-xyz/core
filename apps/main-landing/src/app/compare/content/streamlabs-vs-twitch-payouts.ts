import { AnswerPageContent } from '@/components/answer-page';

export const streamlabsVsTwitchPayouts: AnswerPageContent = {
  slug: 'streamlabs-vs-twitch-payouts',
  title: 'Streamlabs vs Twitch Payouts (2026): Which Pays Streamers More?',
  description:
    'Compare Streamlabs donations to Twitch subs and bits. See which pays more, which is faster, and which has fewer fees.',
  datePublished: '2026-01-01',
  dateModified: '2026-01-13',

  heroTitle: 'Streamlabs Donations vs Twitch Payouts',
  heroSubtitle:
    "Should you push viewers toward Twitch subs or third-party donations? Here's how the money actually breaks down.",

  sections: [
    {
      title: 'How much do you actually keep from each?',
      content: `Twitch affiliates keep 50% of subscription revenue. A $4.99 sub gives you about $2.50. Partners can negotiate up to 70%, but most streamers never reach that level.

Streamlabs donations go directly to you minus PayPal fees (6-10% effective on a typical $10 donation). A $10 donation nets you $9.07*. That's 91% versus Twitch's 50%. The math strongly favors direct donations.

*Estimate based on fees for an international donation in USD to the US via PayPal.`,
    },
    {
      title: 'Are twitch bits better than donations?',
      content: `No. Twitch takes roughly 30% when viewers buy Bits. A viewer spends $10 on bits to gift to you, but only $7 reaches your account. With direct donations, that same $10 becomes $9.07 after PayPal fees.

Bits do integrate with Twitch's ecosystem - viewers earn badges and feel part of the platform. But financially, direct donations win every time.`,
    },
    {
      title: 'Which gets you paid faster?',
      content: `Twitch uses [Net-15 payments](/guides/twitch-payout-delays) with a minimum threshold of $50 or $100, depending on the location and method. Money earned in January arrives mid-February at best, if you hit the threshold. Many small streamers wait months to reach $100.

Streamlabs donations hit your PayPal immediately. You can transfer to your bank in 1-3 days. No waiting for month-end, no minimum threshold.`,
    },
    {
      title: 'What about recurring income?',
      content: `Twitch subs do offer recurring revenue. A subscriber pays monthly without having to manually donate again. This predictability helps with income planning.

Donations are one-time unless viewers choose to return. However, the higher revenue per transaction often makes up for the lack of automatic renewal. Many successful streamers emphasize donations over subs for this reason.`,
    },
    {
      title: 'Which has more chargeback risk?',
      content: `Twitch handles chargebacks on their end for subs and bits. If someone disputes a sub, Twitch deals with it - you just lose that month's revenue.

Streamlabs donations through PayPal put the [chargeback risk](/guides/streamer-chargebacks) on you. A disputed donation can cost you anywhere up to $25. This is the biggest downside of PayPal-based donations.`,
    },
    {
      title: 'Which should you promote?',
      content: `The smart strategy is offering both. Let viewers sub for the badges and emotes they want, but make donation links visible for those who want more of their money to reach you directly.

For the highest revenue with no chargeback risk, consider instant payout alternatives that offer lower fees than both Twitch and PayPal.`,
    },
  ],

  comparison: {
    idrissName: 'Streamlabs',
    competitorName: 'Twitch',
    items: [
      {
        label: 'Your earnings (on $10*)',
        idriss: '$9.07 (91%)',
        competitor: '$2.50 (50%)',
      },
      {
        label: 'Payout speed',
        idriss: '1-3 days via PayPal',
        competitor: '15-75 days',
      },
      {
        label: 'Minimum threshold',
        idriss: 'None',
        competitor: '$50',
      },
      {
        label: 'Recurring payments',
        idriss: false,
        competitor: true,
      },
      {
        label: 'Chargeback protection',
        idriss: false,
        competitor: true,
      },
      {
        label: 'Viewer badges/emotes',
        idriss: false,
        competitor: true,
      },
    ],
    footnote: '*Estimate based on fees for an international donation in USD to the US via PayPal.',
  },

  faq: [
    {
      question: 'Do streamers make more from subs or donations?',
      answer:
        'Per dollar spent by viewers, donations pay more. You keep 90%+ of donations versus 50% of sub revenue. However, subs provide recurring monthly income.',
    },
    {
      question: 'Why do some streamers prefer Twitch subs?',
      answer:
        "Subs integrate with Twitch's ecosystem - badges, emotes, and sub-only chat. Some streamers value community features over maximizing revenue per transaction.",
    },
    {
      question: 'Can I disable Twitch subs and only use donations?',
      answer:
        "Affiliates must keep subs enabled per Twitch's agreement. However, you can choose not to promote them and emphasize donations instead.",
    },
    {
      question: 'What about Twitch Prime subs?',
      answer:
        'Prime subs pay the same as regular subs ($2.50) but take even longer to process - up to 45 extra days for "verification." They\'re free for viewers but slow for you.',
    },
    {
      question: 'Is there a way to get the best of both?',
      answer:
        'Yes. Use Twitch subs for the community features and recurring income, but offer donation options for viewers who want more of their money to reach you. Consider platforms with instant payouts and no chargebacks for best results.',
    },
  ],

  disclaimer:
    'Note: Fees, payout schedules, and platform policies can change over time. The information in this article reflects standard rates and practices as of the last update of this article. For the most up-to-date details, check the official documentation of each platform.',

  ctaTitle: 'Want to Keep More of Your Donations?',
  ctaButtonText: 'Try IDRISS Free',
  ctaButtonHref: 'https://idriss.xyz',
};
