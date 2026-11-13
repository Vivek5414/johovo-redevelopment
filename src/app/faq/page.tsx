import type { Metadata } from "next";
import { PolicyPageLayout } from "@/components/policy/policy-layout";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | JOHOVO",
  description:
    "Quick answers to common questions about JOHOVO herbal products, orders, shipping timelines, returns, and ingredients.",
};

const FAQ_ITEMS = [
  {
    question: "What is JOHOVO?",
    answer:
      "JOHOVO is a premium botanical and Ayurvedic beauty brand based in Tamil Nadu, India. We craft pure, gentle, and effective herbal cosmetics—including traditional hair oils, restorative face packs, and nourishing rose body care—delivered across India.",
  },
  {
    question: "Do you deliver all over India?",
    answer:
      "Yes! We deliver to over 19,000+ pin codes across all states and Union Territories in India through our verified logistics partners (including Delhivery, BlueDart, and India Post).",
  },
  {
    question: "How long does delivery usually take?",
    answer:
      "Delivery timelines depend on your location: orders within Tamil Nadu typically take 2 to 4 business days, while deliveries to other states across India arrive within 3 to 7 business days.",
  },
  {
    question: "Is shipping free?",
    answer:
      "Yes, we provide 100% Free Standard Shipping on all cart totals above ₹999. For orders under ₹999, flat shipping is ₹50 within Tamil Nadu and ₹80 for all other states.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We accept instant UPI payments (Google Pay, PhonePe, Paytm, BHIM), all major Credit and Debit Cards (Visa, MasterCard, RuPay), Net Banking across 50+ Indian banks, and select Cash on Delivery (COD).",
  },
  {
    question: "Are JOHOVO formulations 100% herbal and chemical-free?",
    answer:
      "Yes, our formulations are crafted using time-honored Ayurvedic herbs like Bhringaraj, Amla, Neem, Kasthuri Manjal, and pure plant oils. We formulate without harsh sulfates, parabens, synthetic bleach, or heavy metals.",
  },
  {
    question: "How can I track my parcel once shipped?",
    answer:
      "As soon as your order leaves our fulfillment center, we send a live Airway Bill (AWB) tracking link via SMS and WhatsApp so you can monitor your parcel checkpoint by checkpoint.",
  },
  {
    question: "What is your return & exchange policy?",
    answer:
      "We offer a 7 to 10 day return window from the date of delivery. If an item arrives damaged or you wish to request an exchange, simply reach out to our WhatsApp customer support with your invoice number.",
  },
  {
    question: "How do I perform a skin sensitivity patch test?",
    answer:
      "Apply a dime-sized amount of the product on your inner forearm or behind the ear. Leave for 15-20 minutes. If no irritation, redness, or burning occurs, the botanical formula is safe for your skin.",
  },
  {
    question: "How can I contact JOHOVO customer care?",
    answer:
      "You can connect directly with our support desk via WhatsApp at +91 91765 13323, call us at +91 7845873369, or email support@johovo.in. We are available 7 days a week.",
  },
];

export default function FaqPage() {
  return (
    <PolicyPageLayout
      activeSlug="faq"
      description="Find clear, immediate answers regarding order fulfillment, delivery timelines, product ingredients, returns, and support."
      eyebrow="HELP & CUSTOMER CARE"
      gradientTitlePart="Questions"
      lastUpdated="Frequently Updated for 2026"
      leadNotice="Have a question that isn't answered below? Reach out anytime via our 7-day WhatsApp support desk (+91 91765 13323) for personalized assistance."
      title="Frequently Asked"
    >
      <div className={styles.faqWrapper}>
        {FAQ_ITEMS.map((item, idx) => (
          <details className={styles.faqItem} key={idx} open={idx === 0}>
            <summary className={styles.faqSummary}>
              <div className={styles.questionLeft}>
                <span className={styles.questionIndex}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span>{item.question}</span>
              </div>
              <span className={styles.toggleIcon}>
                <KeyboardArrowDownRoundedIcon fontSize="inherit" />
              </span>
            </summary>
            <div className={styles.faqAnswer}>
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </PolicyPageLayout>
  );
}
