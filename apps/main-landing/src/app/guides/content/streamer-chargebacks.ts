import { AnswerPageContent } from '@/components/answer-page';

export const streamerChargebacks: AnswerPageContent = {
  slug: 'streamer-chargebacks',
  title: 'How to Avoid Chargebacks as a Streamer (2026 Guide)',
  description:
    'Learn how donation chargebacks work, how much they cost streamers, and proven ways to protect yourself from chargeback fraud.',
  datePublished: '2026-01-01',
  dateModified: '2026-01-09',

  heroTitle: 'How to Avoid Chargebacks as a Streamer',
  heroSubtitle:
    "Chargebacks cost streamers thousands every year. Here's exactly how they work and what you can do about them.",

  sections: [
    {
      title: 'What Is a Chargeback and How Does It Work?',
      content: `A chargeback happens when a donor disputes a transaction with their bank or PayPal. The payment processor reverses the transaction, pulling money directly from your account.

Unlike refunds (which you control), chargebacks are initiated by the donor's bank. You often lose even when the donation was completely legitimate. The process typically takes 30+ days to resolve, during which your funds may be frozen.`,
    },
    {
      title: 'How Much Do Chargebacks Actually Cost?',
      content: `You lose more than the donation amount. PayPal charges a $20 fee per chargeback. Credit card processors charge $15. You pay this fee win or lose.

Example: A $50 donation gets charged back. You lose $50 + $20 fee = $70 total. If your PayPal balance was low, you'll have a negative balance and potentially a locked account until you pay it off.`,
    },
    {
      title: 'Why Do Donors File Chargebacks?',
      content: `Some chargebacks are fraud - trolls donate large amounts for attention, then take the money back. The [infamous iNexus_Ninja case](https://dotesports.com/streaming/news/twitch-donation-troll-scams-streamers-out-of-50000) involved $50,000 in donations across multiple streamers before PayPal finally stepped in.

Others are "friendly fraud" - donors regret their purchase, forgot they donated, or a family member used their card without permission. Regardless of intent, you bear the cost.`,
    },
    {
      title: "Why Can't PayPal Protect Streamers?",
      content: `PayPal's Seller Protection doesn't cover donations or digital services. Since you're not shipping a physical product, you have no "proof of delivery." Banks and PayPal typically side with the person disputing the charge.

Even with video evidence of the donation on stream, you may still lose the dispute. The system is designed to protect buyers, not creators.`,
    },
    {
      title: 'What Are Your Options for Protection?',
      content: `**Partial protection:** Require donors to log in with verified accounts. Set minimum donation amounts to discourage trolls. Hold funds for 30+ days before spending (though this defeats the purpose of getting paid).

**Full protection:** Use payment methods that don't allow chargebacks. Some platforms process payments in ways that are final and irreversible - once confirmed, the money is permanently yours. Learn more about [instant payout alternatives](/guides/instant-payouts-for-streamers) that eliminate chargeback risk entirely.`,
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
      question:
        'Does Streamlabs or StreamElements protect against chargebacks?',
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
        'Yes - use platforms where transactions are final and irreversible. IDRISS donations cannot be charged back once confirmed, eliminating this risk entirely.',
    },
  ],

  ctaTitle: 'Want Chargeback-Proof Donations?',
  ctaButtonText: 'Try IDRISS Free',
  ctaButtonHref: 'https://idriss.xyz',
};
