import { AnswerPageContent } from '@/components/answer-page';

export const twitchPayoutDelays: AnswerPageContent = {
  slug: 'twitch-payout-delays',
  title: 'Why Is My Twitch Payout Taking So Long? (2026 Explained)',
  description:
    "Understand Twitch's Net-15 payout system, the $100 minimum threshold, and why your earnings take 15-45 days to arrive.",
  datePublished: '2026-01-01',
  dateModified: '2026-01-09',

  heroTitle: 'Why Is My Twitch Payout Taking So Long?',
  heroSubtitle:
    "Twitch's payout system is confusing. Here's exactly how it works, why it takes so long, and what you can do about it.",

  sections: [
    {
      title: "How Does Twitch's Net-15 System Work?",
      content: `Twitch calculates your earnings at the end of each month, then pays [15 days later](https://help.twitch.tv/s/article/affiliate-payout-faq). Earn money in January? You'll get paid around February 15th.

But that's the best case. The 15-day clock doesn't start until you hit the minimum threshold - and there are additional delays for certain income types.`,
    },
    {
      title: 'What Is the Minimum Payout Threshold?',
      content: `You need at least $100 in earnings before Twitch will pay you. For affiliates earning 50% of a $4.99 sub ($2.50), that's 40 subscribers minimum.

If you don't hit $100, your balance rolls over to the next month. Many small streamers wait 3-6 months before their first payout. Some payment methods like wire transfer require $100 even in countries where other methods have a $50 minimum.`,
    },
    {
      title: 'Why Do Prime Subs Take Even Longer?',
      content: `[Twitch Prime subscriptions](https://help.twitch.tv/s/article/twitch-prime-guide) require "additional verification" and can take up to 45 days after month-end to process.

A Prime sub from January 1st might not hit your payout until mid-March - that's 75 days from when the viewer subscribed to when you see the money.`,
    },
    {
      title: 'Can I Lose My Earnings If I Stop Streaming?',
      content: `Yes. If your account is inactive for 12 months and you haven't earned $100, Twitch can terminate your affiliate status and forfeit your balance.

You also have 180 days to submit tax information after earning money. Miss the deadline and you forfeit those earnings on a rolling basis.`,
    },
    {
      title: 'Is There Any Way to Get Paid Faster on Twitch?',
      content: `No. Twitch offers no expedited payout option. Even partners with millions of followers wait the same 15 days.

The only way to get faster access to your money is through direct donations outside Twitch's system. See our guide on [instant payout alternatives](/guides/instant-payouts-for-streamers) for options that pay immediately.`,
    },
  ],

  comparison: {
    idrissName: 'Instant Payouts',
    competitorName: 'Twitch Net-15',
    items: [
      {
        label: 'Time to access funds',
        idriss: 'Immediate',
        competitor: '15-45 days',
      },
      {
        label: 'Minimum threshold',
        idriss: 'None',
        competitor: '$100',
      },
      {
        label: 'Your cut of revenue',
        idriss: '99%',
        competitor: '50%',
      },
      {
        label: 'Risk of forfeiture',
        idriss: false,
        competitor: true,
      },
    ],
  },

  faq: [
    {
      question: 'When exactly does Twitch pay affiliates?',
      answer:
        "Twitch pays 15 days after month-end, but only if you've earned $100+. January earnings arrive around February 15th, assuming you hit the threshold.",
    },
    {
      question: 'Why does Twitch hold money for 15 days?',
      answer:
        "Twitch claims it's for payment processing. However, many platforms pay instantly, suggesting it's a business choice rather than technical necessity.",
    },
    {
      question: "What happens if I don't reach $100?",
      answer:
        "Your balance rolls over. If you're inactive for 12 months without reaching threshold, Twitch may close your affiliate status and keep your earnings.",
    },
    {
      question: 'Do donations have the same delays?',
      answer:
        'No. Third-party donations through Streamlabs or StreamElements go to your PayPal immediately. However, PayPal has its own delays and [chargeback risks](/guides/streamer-chargebacks).',
    },
    {
      question: "What's the fastest way to get paid as a streamer?",
      answer:
        'Instant payout platforms like IDRISS pay the moment someone donates. No thresholds, no waiting periods, no month-end processing.',
    },
  ],

  ctaTitle: 'Tired of Waiting for Your Money?',
  ctaButtonText: 'Get Instant Payouts',
  ctaButtonHref: 'https://idriss.xyz',
};
