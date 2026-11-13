import type { Metadata } from "next";
import { PolicyPageLayout, type PolicySectionData } from "@/components/policy/policy-layout";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CopyrightRoundedIcon from "@mui/icons-material/CopyrightRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import BalanceRoundedIcon from "@mui/icons-material/BalanceRounded";

export const metadata: Metadata = {
  title: "Terms & Conditions | JOHOVO",
  description:
    "Official terms of service governing access to JOHOVO website, product purchases, user obligations, intellectual property, and Indian jurisdiction.",
};

const termsSections: PolicySectionData[] = [
  {
    title: "Acceptance of Agreement & Definitions",
    icon: <GavelRoundedIcon fontSize="inherit" />,
    lead: "Welcome to www.johovo.in, owned and operated by JOHOVO. By accessing this platform, browsing our product catalogue, or initiating orders, you explicitly consent to these Terms & Conditions.",
    items: [
      {
        title: "Company",
        text: "Refers to JOHOVO, registered at 20/3, Natarajapuram West, Nandivaram, Guduvancheri, Tamil Nadu - 603202.",
      },
      {
        title: "Customer / User",
        text: "Any individual or legal entity accessing the website or procuring products through online checkout or customer care channels.",
      },
      {
        title: "Products",
        text: "Authentic herbal cosmetic formulations, hair oils, face packs, body scrubs, and botanical care items catalogued on the portal.",
      },
    ],
  },
  {
    title: "Eligibility & Acceptable Use",
    icon: <ShieldRoundedIcon fontSize="inherit" />,
    bullets: [
      "You must be at least 18 years of age or possess legal parental/guardian consent to enter into commercial transactions on this website.",
      "You agree not to exploit vulnerabilities, inject malicious code, harvest data, or misuse the checkout system for unauthorized commercial redistribution.",
      "Product availability and promotional pricing are subject to real-time adjustments without prior notice.",
    ],
  },
  {
    title: "Orders, Pricing & Payment Terms",
    icon: <PaymentsRoundedIcon fontSize="inherit" />,
    items: [
      {
        title: "Contract Formation",
        text: "Placing an order constitutes an offer to purchase. An order is confirmed once payment authorization is cleared and a system order ID / invoice number is generated.",
      },
      {
        title: "Accepted Modes of Payment",
        text: "We support verified UPI transfers (Google Pay, PhonePe, Paytm), Visa/Mastercard/RuPay credit and debit cards, net banking across major Indian banks, and select Cash on Delivery services.",
      },
      {
        title: "Pricing Transparency",
        text: "All displayed prices are denominated in Indian Rupees (INR) and are inclusive of statutory GST unless explicitly stated otherwise.",
      },
    ],
  },
  {
    title: "Product Quality & Botanical Liability",
    icon: <ShoppingBagRoundedIcon fontSize="inherit" />,
    items: [
      {
        title: "Authentic Formulations",
        text: "All JOHOVO and IyalMooligai formulations utilize natural ingredients and traditional botanical processes manufactured under stringent hygienic oversight.",
      },
      {
        title: "Skin Sensitivity & Patch Testing",
        text: "Because natural plant extracts contain active biological compounds, we strongly advise patch testing before first application. Our products are cosmetic formulations and not intended to diagnose, treat, or cure medical conditions.",
      },
    ],
  },
  {
    title: "Intellectual Property Rights",
    icon: <CopyrightRoundedIcon fontSize="inherit" />,
    lead: "All creative assets, brand marks, product names, formulation designs, graphics, packaging artwork, and digital copy hosted on www.johovo.in are the exclusive proprietary property of JOHOVO and protected by the Copyright Act, 1957 and Indian Trademark laws. Unauthorized reproduction or mirror hosting is strictly prohibited.",
  },
  {
    title: "Governing Law & Legal Jurisdiction",
    icon: <BalanceRoundedIcon fontSize="inherit" />,
    lead: "This agreement is executed and governed in accordance with the substantive laws of India, including the Information Technology Act, 2000 (IT Act) and the Consumer Protection Act, 2019. Any dispute, claim, or controversy arising out of or related to website usage or product purchases shall be subject to the exclusive jurisdiction of the competent civil courts in Chengalpattu / Chennai, Tamil Nadu.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <PolicyPageLayout
      activeSlug="terms-and-conditions"
      description="Review the legal agreement and terms of service that govern website browsing, product orders, payments, and platform usage."
      eyebrow="LEGAL TERMS & GOVERNANCE"
      gradientTitlePart="Conditions"
      lastUpdated="Effective: November 2026"
      leadNotice="By browsing www.johovo.in or ordering our herbal products, you agree to these transparent terms of service designed to protect both consumer rights and fair commerce."
      sections={termsSections}
      title="Terms &"
    />
  );
}
