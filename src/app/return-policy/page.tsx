import type { Metadata } from "next";
import { PolicyPageLayout, type PolicySectionData } from "@/components/policy/policy-layout";
import AssignmentReturnRoundedIcon from "@mui/icons-material/AssignmentReturnRounded";
import RuleRoundedIcon from "@mui/icons-material/RuleRounded";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";

export const metadata: Metadata = {
  title: "Return & Refund Policy | JOHOVO",
  description:
    "Learn about JOHOVO's 7-10 day return window, item eligibility, inspection standards, exchanges, and instant refund processing.",
};

const returnSections: PolicySectionData[] = [
  {
    title: "Return Window & Eligibility",
    icon: <RuleRoundedIcon fontSize="inherit" />,
    lead: "We take tremendous pride in the quality and authentic botanical purity of JOHOVO formulations. If your product does not meet expectations, you are protected by our customer-first return guarantee.",
    bullets: [
      "Return requests must be initiated within 7 to 10 calendar days from the confirmed date of delivery.",
      "The product must remain in its original outer box with all tamper-proof seals, brand labels, and safety caps intact.",
      "Items must be unadulterated, unconsumed, and accompanied by the original tax invoice or order number.",
      "In the rare case of transit leakage or defects, photographic evidence shared within 24 hours qualifies for immediate free pickup and re-shipment.",
    ],
  },
  {
    title: "Simple 4-Step Return Process",
    icon: <AssignmentReturnRoundedIcon fontSize="inherit" />,
    items: [
      {
        title: "Step 1: Contact Support",
        text: "Reach out to our customer care team via WhatsApp (+91 91765 13323) or email (support@johovo.in) citing your invoice number.",
      },
      {
        title: "Step 2: RMA Authorization",
        text: "Our team will evaluate the details and issue a Return Merchandise Authorization (RMA) reference code within 4 to 6 business hours.",
      },
      {
        title: "Step 3: Secure Packing & Dispatch",
        text: "Safely wrap the item in protective material to prevent damage and hand it to our designated courier pickup, or courier it to our fulfillment hub in Guduvancheri, Tamil Nadu.",
      },
      {
        title: "Step 4: Quality Inspection",
        text: "Our warehouse inspection team checks the seal and batch identity upon receipt before signing off on resolution.",
      },
    ],
  },
  {
    title: "Refund Issuance & Timelines",
    icon: <CurrencyExchangeRoundedIcon fontSize="inherit" />,
    items: [
      {
        title: "Original Payment Method",
        text: "Refunds for prepaid transactions (UPI, Credit/Debit cards, Net Banking) are automatically credited back to your original source account within 3 to 5 business days post-inspection.",
      },
      {
        title: "Cash on Delivery Orders",
        text: "For COD deliveries, refunds are credited directly to your bank account or verified UPI ID upon sharing IFSC and account details.",
      },
      {
        title: "Instant Store Credit / Voucher",
        text: "If preferred, you may opt for instant JOHOVO store credit which never expires and can be redeemed across any product.",
      },
    ],
  },
  {
    title: "Easy Product Exchanges",
    icon: <CachedRoundedIcon fontSize="inherit" />,
    items: [
      {
        title: "Variant or Scent Swaps",
        text: "Wish to switch between our Herbal Face Pack and Orange Face Pack or explore our Rose Body range? Let our support team know, and we will dispatch your replacement as soon as the initial parcel is picked up.",
      },
      {
        title: "Zero Exchange Fee",
        text: "We do not assess processing fees for product exchanges of equal or greater value.",
      },
    ],
  },
  {
    title: "Non-Returnable Items",
    icon: <BlockRoundedIcon fontSize="inherit" />,
    lead: "To protect the biological safety and sanitary hygiene of all our herbal patrons, certain items cannot be returned once opened:",
    bullets: [
      "Any product where the safety seal has been broken, peeled, or used.",
      "Customized gift hampers or personalized bespoke combinations.",
      "Products returned past the 10-day post-delivery cutoff window.",
      "Items purchased under final clearance promotional flash sales clearly marked as non-refundable.",
    ],
  },
];

export default function ReturnPolicyPage() {
  return (
    <PolicyPageLayout
      activeSlug="return-policy"
      description="Transparent guidelines on returning or exchanging your herbal care purchases, inspecting seals, and timely refund processing."
      eyebrow="CUSTOMER SATISFACTION"
      gradientTitlePart="Policy"
      lastUpdated="Effective: November 2026"
      leadNotice="Your trust is paramount. Every return or replacement request is personally reviewed by our support team to guarantee a smooth and hassle-free resolution."
      sections={returnSections}
      title="Return & Refund"
    />
  );
}
