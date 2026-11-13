import type { Metadata } from "next";
import { PolicyPageLayout, type PolicySectionData } from "@/components/policy/policy-layout";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import CookieRoundedIcon from "@mui/icons-material/CookieRounded";

export const metadata: Metadata = {
  title: "Privacy Policy | JOHOVO",
  description:
    "Learn how JOHOVO safeguards your personal information, encrypted payment records, delivery details, and respects your consumer privacy rights.",
};

const privacySections: PolicySectionData[] = [
  {
    title: "Information We Collect",
    icon: <StorageRoundedIcon fontSize="inherit" />,
    lead: "We only collect data strictly necessary to fulfill your orders, provide reliable logistics tracking, and enhance your digital browsing experience.",
    items: [
      {
        title: "Personal Contact Data",
        text: "Your name, phone number, delivery address, postal pin code, and email address shared during cart checkout or support inquiries.",
      },
      {
        title: "Transaction & Payment Logs",
        text: "Order IDs, billing addresses, invoice totals, and gateway confirmation tokens. We never store credit/debit card numbers or CVVs on our servers — all payments are tokenized via PCI-DSS compliant providers.",
      },
      {
        title: "Device & Technical Identifiers",
        text: "Browser version, IP address, device viewport, and referring URLs used to optimize mobile responsiveness and prevent fraudulent automated bots.",
      },
    ],
  },
  {
    title: "How We Utilize Your Information",
    icon: <ManageAccountsRoundedIcon fontSize="inherit" />,
    bullets: [
      "Order Fulfillment: Packaging, labeling, shipping, and providing automated SMS/WhatsApp dispatch alerts.",
      "Customer Support: Resolving delivery queries, return requests, and product usage consultations.",
      "Platform Security: Defending against fraudulent card transactions, cyber threats, and identity spoofing.",
      "Service Enhancements: Evaluating anonymous aggregate shopping patterns to improve inventory stock and formula curation.",
    ],
  },
  {
    title: "Data Sharing & Third Parties",
    icon: <ShareRoundedIcon fontSize="inherit" />,
    lead: "We strictly never sell, lease, or monetize your personal information to third-party data brokers.",
    items: [
      {
        title: "Logistics Partners",
        text: "Delivery couriers (e.g., Delhivery, BlueDart, India Post) receive only your name, phone number, and physical destination to execute delivery.",
      },
      {
        title: "Authorized Payment Gateways",
        text: "Encrypted payment gateways receive transaction amounts and billing identifiers to authorize financial settlements.",
      },
      {
        title: "Legal Mandates",
        text: "We only disclose records if compelled by lawful Indian judicial orders, GST tax audits, or statutory regulatory frameworks under the IT Act 2000.",
      },
    ],
  },
  {
    title: "Encryption & Security Architecture",
    icon: <SecurityRoundedIcon fontSize="inherit" />,
    items: [
      {
        title: "SSL/TLS 256-Bit Encryption",
        text: "All traffic across www.johovo.in is encrypted end-to-end using modern TLS cryptographic certificates.",
      },
      {
        title: "Access Controls & Least Privilege",
        text: "Customer databases and administrative receipts are guarded behind multi-factor authentication, restrictive role-based access, and audited database logs.",
      },
    ],
  },
  {
    title: "Cookies & Anonymous Analytics",
    icon: <CookieRoundedIcon fontSize="inherit" />,
    lead: "We utilize essential session cookies to remember your shopping cart items, selected state, and security tokens. You may disable cookies in your browser settings at any time without impacting basic page reading.",
  },
  {
    title: "Your Rights & Data Portability",
    icon: <LockResetRoundedIcon fontSize="inherit" />,
    items: [
      {
        title: "Access & Rectification",
        text: "You hold the right to request a copy of your stored order records or ask us to update obsolete contact details.",
      },
      {
        title: "Right to Erasure",
        text: "You can request deletion of non-statutory personal data from our marketing systems by emailing support@johovo.in.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout
      activeSlug="privacy-policy"
      description="Our uncompromising pledge to protect your personal identity, tokenized transactions, delivery coordinates, and browsing privacy."
      eyebrow="DATA INTEGRITY & SECURITY"
      gradientTitlePart="Policy"
      lastUpdated="Effective: November 2026"
      leadNotice="At JOHOVO, privacy is a fundamental standard. We never monetize customer information or share contact details with advertisers."
      sections={privacySections}
      title="Consumer Privacy"
    />
  );
}
