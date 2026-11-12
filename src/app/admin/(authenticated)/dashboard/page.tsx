import Link from "next/link";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import ContactMailRoundedIcon from "@mui/icons-material/ContactMailRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { catalogProducts, getCatalogCategories } from "@/lib/catalog/migrated-catalog";
import { StatsCard } from "@/components/admin/StatsCard/StatsCard";
import { DashboardCharts } from "@/components/admin/DashboardCharts/DashboardCharts";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  // Query database statistics directly from Neon
  const [
    productEnquiriesCount,
    contactEnquiriesCount,
    whatsappClicksCount,
    callClicksCount,
    recentProductEnquiries,
    recentContactEnquiries,
    receiptsCount,
    dailyTimeline,
    receiptRevenueRows,
    topInquiredProducts,
    deviceBreakdownRows,
    topPagesRows,
    paymentModeRows,
  ] = await Promise.all([
    sql`SELECT count(*)::int as count FROM product_enquiries;`.then((r) => r[0]?.count ?? 0).catch(() => 0),
    sql`SELECT count(*)::int as count FROM contact_enquiries;`.then((r) => r[0]?.count ?? 0).catch(() => 0),
    sql`SELECT count(*)::int as count FROM whatsapp_clicks;`.then((r) => r[0]?.count ?? 0).catch(() => 0),
    sql`SELECT count(*)::int as count FROM call_clicks;`.then((r) => r[0]?.count ?? 0).catch(() => 0),
    sql`SELECT id, product_name, name, phone, created_at FROM product_enquiries ORDER BY created_at DESC LIMIT 5;`.catch(() => []),
    sql`SELECT id, name, phone, product, created_at FROM contact_enquiries ORDER BY created_at DESC LIMIT 5;`.catch(() => []),
    sql`SELECT count(*)::int as count FROM receipt;`.then((r) => r[0]?.count ?? 0).catch(() => 0),
    sql`
      SELECT 
        to_char(day, 'DD Mon') as day_label,
        coalesce(enquiries, 0)::int as enquiries,
        coalesce(interactions, 0)::int as interactions
      FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day'::interval) day
      LEFT JOIN (
        SELECT date_trunc('day', created_at) as enq_day, count(*) as enquiries 
        FROM (SELECT created_at FROM product_enquiries UNION ALL SELECT created_at FROM contact_enquiries) e
        GROUP BY 1
      ) enq ON enq.enq_day = date_trunc('day', day)
      LEFT JOIN (
        SELECT date_trunc('day', created_at) as int_day, count(*) as interactions 
        FROM (SELECT created_at FROM whatsapp_clicks UNION ALL SELECT created_at FROM call_clicks) i
        GROUP BY 1
      ) inter ON inter.int_day = date_trunc('day', day)
      ORDER BY day ASC;
    `.catch(() => []),
    sql`
      SELECT 
        to_char(day, 'DD Mon') as day_label,
        coalesce(sum(total_amount), 0)::numeric as revenue
      FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day'::interval) day
      LEFT JOIN receipt r ON date_trunc('day', r.created_at) = date_trunc('day', day)
      GROUP BY day
      ORDER BY day ASC;
    `.catch(() => []),
    sql`
      SELECT product_name as name, count(*)::int as enquiries
      FROM product_enquiries
      WHERE product_name IS NOT NULL AND product_name != ''
      GROUP BY product_name
      ORDER BY enquiries DESC
      LIMIT 6;
    `.catch(() => []),
    sql`
      SELECT coalesce(nullif(machine, ''), 'Desktop') as machine_type, count(*)::int as count
      FROM (
        SELECT machine FROM whatsapp_clicks
        UNION ALL
        SELECT machine FROM call_clicks
      ) dev
      GROUP BY machine_type
      ORDER BY count DESC;
    `.catch(() => []),
    sql`
      SELECT 
        regexp_replace(page_url, '^https?://[^/]+', '') as page_path,
        count(*)::int as count
      FROM (
        SELECT page_url FROM whatsapp_clicks
        UNION ALL
        SELECT page_url FROM call_clicks
      ) p
      WHERE page_url IS NOT NULL
      GROUP BY page_path
      ORDER BY count DESC
      LIMIT 6;
    `.catch(() => []),
    sql`
      SELECT payment_method, count(*)::int as count
      FROM receipt
      WHERE payment_method IS NOT NULL
      GROUP BY payment_method
      ORDER BY count DESC;
    `.catch(() => []),
  ]);

  const categories = getCatalogCategories();
  const totalProducts = catalogProducts.length;
  const totalCategories = categories.length;

  // Visuals Data Formatting
  const distributionData = [
    { name: "Product Enquiries", value: productEnquiriesCount, color: "#2e6443" },
    { name: "Contact Leads", value: contactEnquiriesCount, color: "#166534" },
    { name: "WhatsApp Clicks", value: whatsappClicksCount, color: "#25D366" },
    { name: "Call Clicks", value: callClicksCount, color: "#be185d" },
  ];

  const categoryData = categories.map((c) => ({
    name: c.name.replace("IyalMooligai", "").replace("JOHOVO", "").trim() || c.name,
    count: c.productCount,
  }));

  const timelineData =
    dailyTimeline && dailyTimeline.length > 0
      ? dailyTimeline.map((d: any) => ({
          day: d.day_label,
          enquiries: Number(d.enquiries) || 0,
          interactions: Number(d.interactions) || 0,
        }))
      : [];

  const revenueData =
    receiptRevenueRows && receiptRevenueRows.length > 0
      ? receiptRevenueRows.map((r: any) => ({
          day: r.day_label,
          revenue: Number(r.revenue) || 0,
        }))
      : [];

  // Actual Product Inquiries Breakdown
  const productInterestData =
    topInquiredProducts && topInquiredProducts.length > 0
      ? topInquiredProducts.map((p: any) => ({
          name: p.name.replace("JOHOVO™", "").replace("IyalMooligai™", "").replace("– Johovo", "").trim(),
          enquiries: Number(p.enquiries) || 0,
        }))
      : [];

  // Actual Device / Platform Breakdown
  const deviceColors: Record<string, string> = {
    Mobile: "#25D366",
    Desktop: "#2e6443",
    Tablet: "#d97706",
    Unknown: "#64748b",
  };
  const deviceData =
    deviceBreakdownRows && deviceBreakdownRows.length > 0
      ? deviceBreakdownRows.map((d: any) => ({
          name: d.machine_type,
          value: Number(d.count) || 0,
          color: deviceColors[d.machine_type] || "#3b82f6",
        }))
      : [];

  // Top Pages
  const pageTrafficData =
    topPagesRows && topPagesRows.length > 0
      ? topPagesRows.map((p: any) => {
          let label = p.page_path || "/";
          if (label === "") label = "/ (Home)";
          if (label.length > 24) label = label.slice(0, 24) + "…";
          return {
            page: label,
            count: Number(p.count) || 0,
          };
        })
      : [];

  // Actual Payment Modes
  const pmPalette = ["#2e6443", "#d97706", "#2563eb", "#be185d", "#8b5cf6"];
  const paymentModeData =
    paymentModeRows && paymentModeRows.length > 0
      ? paymentModeRows.map((pm: any, idx: number) => ({
          name: pm.payment_method,
          value: Number(pm.count) || 0,
          color: pmPalette[idx % pmPalette.length],
        }))
      : [];

  return (
    <div className={styles.dashboard}>
      {/* Welcome Banner */}
      <div className={styles.welcomeHeader}>
        <div>
          <h2 className={styles.welcomeTitle}>Welcome back, {admin.name}</h2>
          <p className={styles.welcomeDesc}>
            JOHOVO database monitoring &amp; centralized administration dashboard.
          </p>
        </div>
        <div className={styles.timestampBadge}>
          Active Session: <strong>{admin.role}</strong>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className={styles.statsGrid}>
        <StatsCard
          href="/admin/products"
          icon={Inventory2RoundedIcon}
          subtext="Active in store"
          title="Products Catalog"
          value={totalProducts}
        />
        <StatsCard
          href="/admin/categories"
          icon={CategoryRoundedIcon}
          subtext="Ayurvedic taxonomy"
          title="Product Categories"
          value={totalCategories}
        />
        <StatsCard
          href="/admin/product-enquiries"
          icon={QuestionAnswerRoundedIcon}
          subtext="Direct product leads"
          title="Product Enquiries"
          value={productEnquiriesCount}
        />
        <StatsCard
          href="/admin/contact-enquiries"
          icon={ContactMailRoundedIcon}
          subtext="General inquiries"
          title="Contact Form Leads"
          value={contactEnquiriesCount}
        />
        <StatsCard
          href="/admin/whatsapp-clicks"
          icon={WhatsAppIcon}
          subtext="Tracked visitor clicks"
          title="WhatsApp Click Events"
          value={whatsappClicksCount}
        />
        <StatsCard
          href="/admin/call-clicks"
          icon={CallRoundedIcon}
          subtext="Tracked phone calls"
          title="Call Click Events"
          value={callClicksCount}
        />
        <StatsCard
          href="/admin/receipts"
          icon={ReceiptLongRoundedIcon}
          subtext="Recorded invoices"
          title="Receipts & Invoices"
          value={receiptsCount}
        />
        <StatsCard
          icon={AdminPanelSettingsRoundedIcon}
          subtext="Authorized account"
          title="Admin Profile"
          value={admin.name.split(" ")[0]}
        />
      </div>

      {/* Visual Analytics & Graphs Section */}
      <DashboardCharts
        categoryData={categoryData}
        deviceData={deviceData}
        distributionData={distributionData}
        pageTrafficData={pageTrafficData}
        paymentModeData={paymentModeData}
        productInterestData={productInterestData}
        revenueData={revenueData}
        timelineData={timelineData}
      />

      {/* Recent Activity Sections */}
      <div className={styles.sectionsGrid}>
        {/* Recent Product Enquiries */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Product Enquiries</h3>
            <Link className={styles.viewAllLink} href="/admin/product-enquiries">
              View All ({productEnquiriesCount}) →
            </Link>
          </div>
          {recentProductEnquiries.length > 0 ? (
            <ul className={styles.activityList}>
              {recentProductEnquiries.map((item: any) => (
                <li className={styles.activityItem} key={item.id}>
                  <div className={styles.activityMeta}>
                    <span className={styles.activityTitle}>{item.name}</span>
                    <span className={styles.activitySub}>
                      Product: <strong>{item.product_name}</strong> • Phone: {item.phone}
                    </span>
                  </div>
                  <time className={styles.activityTime}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </time>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyActivity}>No product enquiries recorded yet.</p>
          )}
        </div>

        {/* Recent Contact Form Enquiries */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Contact Form Leads</h3>
            <Link className={styles.viewAllLink} href="/admin/contact-enquiries">
              View All ({contactEnquiriesCount}) →
            </Link>
          </div>
          {recentContactEnquiries.length > 0 ? (
            <ul className={styles.activityList}>
              {recentContactEnquiries.map((item: any) => (
                <li className={styles.activityItem} key={item.id}>
                  <div className={styles.activityMeta}>
                    <span className={styles.activityTitle}>{item.name}</span>
                    <span className={styles.activitySub}>
                      Phone: {item.phone} {item.product ? `• Interested in: ${item.product}` : ""}
                    </span>
                  </div>
                  <time className={styles.activityTime}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </time>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyActivity}>No contact form enquiries recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
