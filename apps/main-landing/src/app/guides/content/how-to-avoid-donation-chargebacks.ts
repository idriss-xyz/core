import { AnswerPageContent } from '@/components/answer-page';

export const howToAvoidDonationChargebacks: AnswerPageContent = {
  slug: 'how-to-avoid-donation-chargebacks',
  title: 'How to avoid donation chargebacks (2026)',
  description:
    "Most streamers don't realise the hidden risk behind receiving on-stream donations. Explore how you can protect yourself from chargebacks.",
  datePublished: '2026-01-20',
  dateModified: '2026-01-20',

  heroTitle: 'How to avoid donation chargebacks (2026)',
  heroSubtitle:
    "Most streamers don't realise the hidden risk behind receiving on-stream donations. Explore how you can protect yourself from chargebacks.",

  sections: [
    {
      title: 'How do you prevent Twitch chargebacks?',
      content: `For many streamers, a large donation notification is a source of anxiety rather than excitement. In 2026, "friendly fraud" and [chargeback trolls](https://www.reddit.com/r/Twitch/comments/1kjsxad/chargeback_request_made_by_a_viewer/) remain the single biggest threat to a creator's financial stability. Because traditional payment processors almost always side with the donor, understanding how to lock down your income is essential for long-term streaming.`,
    },
    {
      title: 'How much can chargebacks cost?',
      content: `A chargeback isn't just a refund; it's a financial penalty. If a viewer disputes a $100 donation on PayPal, you don't just lose the $100. You are also hit with a non-refundable dispute fee (typically $20 in 2026).`,
    },
    {
      title: 'Which platforms actually protect you?',
      content: `Not all "protection" is created equal. Some services merely block the user after the damage is done, while others prevent the damage entirely.`,
      customTable: {
        headers: ['Platform', 'Protection level', 'Cost of chargeback', 'Window'],
        rows: [
          ['IDRISS', '100%', '$0', '-'],
          ['SE.Pay', 'High', '$0 (Fees covered)', '120 Days'],
          ['Stripe', 'Moderate', '$15', '120 Days'],
          ['PayPal', 'Low', '$20', '180 Days'],
        ],
      },
    },
    {
      title: 'What are the best methods to prevent chargebacks?',
      content: `1. **[Accept crypto/onchain tips](https://idriss.xyz):** Because blockchain transactions are irreversible, chargebacks are technically impossible. Once the funds hit your wallet, they cannot be pulled back by a bank or donor.

2. **Use SE.Pay:** StreamElements' in-house solution uses machine learning to flag high-risk donors and, crucially, covers the chargeback fees if a dispute does occur. However, the donation itself is still refunded.

3. **Set $5 minimums:** Most "trolls" test the waters with $1 or $2 donations to see if they can trigger alerts and then charge back dozens of small amounts to maximize your fee penalties. A $5 minimum makes trolling more expensive for them.

4. **Wait out the 180-day window:** For PayPal donations, the safest (though most difficult) method is to let the funds sit for 180 days before spending them, as this is the standard dispute window.

5. **Use clear "non-refundable" disclaimers:** While not a legal "shield," having clear TOS on your tip page can help you win disputes if you provide screenshots of the disclaimer to PayPal.

6. **Blacklist repeat offenders:** Use tools like the Streamlabs/StreamElements "shared blacklist" to automatically block known chargeback trolls from ever reaching your tip page.

7. **Identify "unverified" senders:** Always check your PayPal transaction details. If a donor is "Unverified," they are significantly more likely to be using a stolen or temporary account.

8. **Enable 3D secure authentication:** If your payment gateway supports it, forcing a 2-factor "handshake" during the donation process shifts the liability for fraud away from you and back to the bank.`,
    },
  ],

  faq: [
    {
      question: 'Can crypto be charged back?',
      answer:
        'No. Unlike credit cards or PayPal, there is no central authority (like a bank) that can forcibly reverse an onchain transaction. This "settlement finality" is why many creators are shifting their largest donations to onchain rails.',
    },
    {
      question: 'What is the standard chargeback window in 2026?',
      answer:
        'For most credit cards (Visa/Mastercard), the standard window is 120 days. However, PayPal allows users to dispute transactions for up to 180 days. In rare cases of extreme fraud, some issuers allow disputes for up to 540 days.',
    },
    {
      question: 'Should I fight a chargeback or just refund it?',
      answer:
        'If you catch a dispute early (an "Inquiry" phase), it is often better to refund the money immediately. This avoids the $20+ chargeback fee and protects your account\'s "health ratio" with the payment processor.',
    },
    {
      question: 'Does a "No Refunds" disclaimer actually work?',
      answer:
        'It helps during a manual review by a human agent, but it does not stop the automated chargeback process. Most banks prioritize "consumer protection" laws over a streamer\'s personal profile text.',
    },
    {
      question: 'Is there a better way to receive donations?',
      answer:
        'While PayPal is the industry standard for many, a growing number of creators are moving their monetization onchain to eliminate high fees and chargeback risks. Moving the monetization layer onchain is growing as a solution for many creators who value instant global access and full ownership of their funds.',
    },
  ],

  disclaimer:
    'Note: Fees, payout schedules, and platform policies can change over time. The information in this article reflects standard rates and practices as of the last update of this article. For the most up-to-date details, check the official documentation of each platform.',

  ctaTitle: 'Want 100% chargeback protection?',
  ctaButtonText: 'Try IDRISS Free',
  ctaButtonHref: 'https://idriss.xyz',
};
