import { AnswerPageContent } from '@/components/answer-page';

export const twitchPayoutDelays: AnswerPageContent = {
  slug: 'twitch-payout-delays',
  title: 'Why is my Twitch payout taking so long? (2026 explained)',
  description:
    "Understand Twitch's Net-15 payout system, the $50 minimum threshold, and why your earnings take 15-45 days to arrive.",
  datePublished: '2026-01-01',
  dateModified: '2026-01-13',

  heroTitle: 'Why Is My Twitch Payout Taking So Long?',
  heroSubtitle:
    "Twitch's payout system can be confusing. Here's exactly how it works, why it takes so long, and what you can do about it.",

  sections: [
    {
      title: "How does Twitch's net-15 system work?",
      content: `Twitch calculates your earnings at the end of each month, then pays [15 days later](https://help.twitch.tv/s/article/affiliate-payout-faq). Earn money in January? You'll get paid around February 15th.

In practice, payouts depend on meeting the minimum payout threshold. If your balance does not reach the threshold in a given month, earnings roll over to the next month, delaying payment further. However, certain earnings such as Prime subscriptions or ad revenue may be adjusted during verification, which can affect the final amount included in a payout.`,
    },
    {
      title: 'What is the minimum payout threshold?',
      content: `You need at least $50 in earnings before Twitch will pay you. For affiliates earning 50% of a $4.99 sub ($2.50), that's 40 subs minimum.

If you don't hit $50, your balance rolls over to the next month. Many small streamers wait 3-6 months before their first payout. Some payment methods like wire transfer require $100 even in countries where other methods have a $50 minimum.`,
    },
    {
      title: 'Why do Prime subs take even longer?',
      content: `[Twitch Prime subscriptions](https://help.twitch.tv/s/article/prime-gaming-revenue-guide?language=en_US) sometimes require "additional verification" and can take up to 45 days after month-end to process.

A Prime sub from January 1st might not hit your payout until mid-March - that's 75 days from when the viewer subscribed to when you see the money.`,
    },
    {
      title: 'Is there any way to get paid faster on Twitch?',
      content: `No. Twitch offers no expedited payout option. Even partners with millions of followers wait the same 15 days.

The only way to get faster access to your money is through direct donations outside Twitch's system.`,
    },
  ],

  comparison: {
    idrissName: 'Donations',
    competitorName: 'Twitch Net-15',
    items: [
      {
        label: 'Time to access funds',
        idriss: 'Immediate',
        competitor: '15-75 days',
      },
      {
        label: 'Minimum threshold',
        idriss: 'None',
        competitor: '$50',
      },
      {
        label: 'Your cut of revenue',
        idriss: '90%+',
        competitor: '50%',
      },
    ],
  },

  faq: [
    {
      question: 'When exactly does Twitch pay streamers?',
      answer:
        "Twitch pays 15 days after the month-end, but only if you've earned $50+. January earnings arrive around February 15th, assuming you hit the threshold.",
    },
    {
      question: 'Why does Twitch hold money for 15 days?',
      answer:
        "Twitch claims it's for payment processing. However, many platforms pay instantly, suggesting it's a business choice rather than technical necessity.",
    },
    {
      question: "What happens if I don't reach $50?",
      answer: 'Your balance rolls over to the next month.',
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

  disclaimer:
    'Note: Fees, payout schedules, and platform policies can change over time. The information in this article reflects standard rates and practices as of the last update of this article. For the most up-to-date details, check the official documentation of each platform.',

  ctaTitle: 'Tired of Waiting for Your Money?',
  ctaButtonText: 'Get Instant Payouts',
  ctaButtonHref: 'https://idriss.xyz',
};
