import { AnswerPageContent } from '@/components/answer-page';

export const streamerChargebacks: AnswerPageContent = {
  slug: 'streamer-chargebacks',
  title: 'How to avoid chargebacks as a streamer (2026 guide)',
  description:
    'Learn how donation chargebacks work, how much they cost streamers, and proven ways to protect yourself from chargeback fraud.',
  datePublished: '2026-01-01',
  dateModified: '2026-01-13',

  heroTitle: 'How to Avoid Chargebacks as a Streamer',
  heroSubtitle:
    "Chargebacks cost streamers thousands every year. Here's exactly how they work and what you can do about them.",

  sections: [
    {
      title: 'What is a chargeback and how does it work?',
      content: `A chargeback happens when a donor disputes a transaction with their bank or PayPal. The payment processor reverses the transaction, pulling money directly from your account.

Unlike refunds, chargebacks are initiated by the donor's bank. You often lose even when the donation was completely legitimate. The process typically takes 30+ days to resolve, during which your funds may be frozen. As seen in [this r/Twitch discussion](https://www.reddit.com/r/Twitch/comments/9oacsh/chargeback_nightmare/), even "obvious" troll donations can result in lost disputes because PayPal often defaults to protecting the buyer, not the creator.`,
    },
    {
      title: 'How much do chargebacks actually cost?',
      content: `You lose more than the donation amount. PayPal charges a $20 fee per chargeback. Credit card processors charge as much as $25. You pay this fee win or lose.

Example: A $50 donation gets charged back. You lose a $20 fee. If your PayPal balance was low, you'll have a negative balance and potentially a locked account until you pay it off.`,
    },
    {
      title: 'Why do donors file chargebacks?',
      content: `Some chargebacks are fraud - trolls donate large amounts for attention, then take the money back. The [infamous iNexus_Ninja case](https://www.reddit.com/r/news/comments/4mpbwc/paypal_refuses_to_refund_twitch_troll_who_donated/) involved $50,000 in donations across multiple streamers before PayPal finally stepped in.

Others are "friendly fraud" - donors regret their purchase, forgot they donated, or a family member used their card without permission. Regardless of intent, you bear the cost.`,
    },
    {
      title: "Why can't PayPal protect streamers?",
      content: `PayPal's Seller Protection doesn't cover donations or digital services. Since you're not shipping a physical product, you have no "proof of delivery." Banks and PayPal typically side with the person disputing the charge. Meanwhile, PayPal's native chargeback protection feature comes at an additional fee.

Even with video evidence of the donation on stream, you may still lose the dispute. The system is designed to protect buyers, not creators.`,
    },
    {
      title: 'What are your options for protection?',
      content: `To get partial protection, require donors to log in with verified accounts. Set minimum donation amounts to discourage trolls. Hold funds for 30+ days before spending (though this defeats the purpose of getting paid).

To achieve full protection, use payment methods that don't allow chargebacks. Some platforms process payments in ways that are final and irreversible. Once confirmed, the money is permanently yours.`,
    },
  ],

  faq: [
    {
      question: 'How long do donors have to file a chargeback?',
      answer:
        'Typically 120 days (about 4 months) from the transaction date. Some banks allow even longer. A January donation could be reversed in May.',
    },
    {
      question: 'Can I win a chargeback dispute?',
      answer:
        'You can try, but success rates are low for digital services. You need evidence the transaction was authorized, which is hard to prove. The process takes 30+ days regardless of outcome.',
    },
    {
      question: 'Do Streamlabs or StreamElements protect against chargebacks?',
      answer:
        "Not really. Both platforms route through PayPal, which doesn't protect donations. StreamElements' SE.Pay covers chargeback fees (not the donation itself) but only for SE.Pay transactions. See our [Streamlabs vs StreamElements comparison](/compare/streamlabs-vs-streamelements) for details.",
    },
    {
      question: 'Will the donor face any consequences?',
      answer:
        'Chargeback fraud is illegal and can result in criminal charges. Twitch bans repeat offenders. However, enforcement is rare and most fraudsters face no real consequences.',
    },
    {
      question: 'Is there a way to completely avoid chargebacks?',
      answer:
        'Yes. Use platforms where transactions are final and irreversible. IDRISS donations cannot be charged back once confirmed, eliminating this risk entirely.',
    },
  ],

  disclaimer:
    'Note: Fees, payout schedules, and platform policies can change over time. The information in this article reflects standard rates and practices as of the last update of this article. For the most up-to-date details, check the official documentation of each platform.',

  ctaTitle: 'Want Chargeback-Proof Donations?',
  ctaButtonText: 'Try IDRISS Free',
  ctaButtonHref: 'https://idriss.xyz',
};
