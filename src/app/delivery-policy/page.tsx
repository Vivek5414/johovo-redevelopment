import type { Metadata } from "next";
import { PolicyPageLayout, type PolicySectionData } from "@/components/policy/policy-layout";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

export const metadata: Metadata = {
  title: "Delivery & Shipping Policy | JOHOVO",
  description:
    "Comprehensive shipping timelines, transit rates, tracking protocols, and delivery guarantees across India for JOHOVO botanical formulations.",
};

const deliverySections: PolicySectionData[] = [
  {
    title: "Shipping Options & Timelines",
    icon: <LocalShippingRoundedIcon fontSize="inherit" />,
    lead: "At JOHOVO, we partner with reliable national courier services to ensure your authentic botanical formulations reach you safely and swiftly.",
    items: [
      {
        title: "Standard Surface Shipping (Default)",
        text: "Delivers within 3 to 7 business days across India. Orders within Tamil Nadu typically arrive in 2 to 4 business days.",
      },
      {
        title: "Express Air Priority",
        text: "Delivers within 1 to 3 business days to major metropolitan corridors and Tier-1 hubs across India.",
      },
      {
        title: "Pan-India Coverage",
        text: "We deliver to over 19,000+ pin codes throughout India, including North East regions and remote districts.",
      },
    ],
  },
  {
    title: "Operating Schedule & Estimates",
    icon: <ScheduleRoundedIcon fontSize="inherit" />,
    items: [
      {
        title: "Order Dispatch Timeframe",
        text: "Orders placed before 2:00 PM IST (Monday through Saturday) are packaged and handed over to courier hubs on the same business day.",
      },
      {
        title: "Business Days",
        text: "Our dispatch and fulfillment center operates Monday through Saturday, excluding Sundays and gazetted national holidays.",
      },
    ],
  },
  {
    title: "Shipping Costs & Free Delivery",
    icon: <CurrencyRupeeRoundedIcon fontSize="inherit" />,
    items: [
      {
        title: "Free Shipping Benefit",
        text: "We offer 100% Free Standard Shipping on all cart totals above ₹999 anywhere in India.",
      },
      {
        title: "Regional Flat Rates",
        text: "For orders under ₹999: Flat ₹50 shipping applies within Tamil Nadu, and flat ₹80 applies for all other states across India.",
      },
    ],
  },
  {
    title: "Order Tracking & Notifications",
    icon: <TrackChangesRoundedIcon fontSize="inherit" />,
    items: [
      {
        title: "Real-Time Tracking Code",
        text: "Once dispatched, an SMS and WhatsApp notification containing your airway bill (AWB) tracking link is dispatched to your registered mobile number.",
      },
      {
        title: "Status Alerts",
        text: "You receive status updates at key transit checkpoints: Picked Up, In Transit, Out for Delivery, and Delivered.",
      },
    ],
  },
  {
    title: "Damaged Parcels & Delivery Exceptions",
    icon: <ReportProblemRoundedIcon fontSize="inherit" />,
    items: [
      {
        title: "Transit Damage Guarantee",
        text: "If an outer carton arrives crushed or visibly punctured, please take a photo/video before unboxing and notify our support within 24 hours for an immediate complimentary replacement.",
      },
      {
        title: "Failed Delivery Attempts",
        text: "Our delivery partners make up to 3 delivery attempts. Please ensure the recipient's phone number is reachable.",
      },
    ],
  },
  {
    title: "Address Accuracy & Modifications",
    icon: <LocationOnRoundedIcon fontSize="inherit" />,
    items: [
      {
        title: "Address Verification",
        text: "Please double-check street numbers, landmarks, and 6-digit pin codes during checkout.",
      },
      {
        title: "Modifying Address Details",
        text: "If you need to adjust shipping details after placing an order, contact our WhatsApp support within 2 hours of order placement.",
      },
    ],
  },
];

export default function DeliveryPolicyPage() {
  return (
    <PolicyPageLayout
      activeSlug="delivery-policy"
      description="Learn about our verified courier timelines, flat shipping tiers, pan-India tracking, and doorstep fulfillment standards."
      eyebrow="SHIPPING & LOGISTICS"
      gradientTitlePart="Policy"
      lastUpdated="Effective: November 2026"
      leadNotice="Enjoy Free Standard Shipping on all orders over ₹999. Every product is securely bubble-wrapped and eco-packaged to ensure pristine delivery."
      sections={deliverySections}
      title="Delivery & Fulfillment"
    />
  );
}
