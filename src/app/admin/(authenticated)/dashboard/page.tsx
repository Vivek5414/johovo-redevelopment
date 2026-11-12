import Link from "next/link";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import ContactMailRoundedIcon from "@mui/icons-material/ContactMailRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { catalogProducts, getCatalogCategories } from "@/lib/catalog/migrated-catalog";
import { StatsCard } from "@/components/admin/StatsCard/StatsCard";
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
    productFilesCount,
    recentProductEnquiries,
    recentContactEnquiries,
  ] = await Promise.all([
    sql`SELECT count(*)::int as count FROM product_enquiries;`.then((r) => r[0]?.count ?? 0).catch(() => 0),
    sql`SELECT count(*)::int as count FROM contact_enquiries;`.then((r) => r[0]?.count ?? 0).catch(() => 0),
    sql`SELECT count(*)::int as count FROM whatsapp_clicks;`.then((r) => r[0]?.count ?? 0).catch(() => 0),
    sql`SELECT count(*)::int as count FROM call_clicks;`.then((r) => r[0]?.count ?? 0).catch(() => 0),
    sql`SELECT count(*)::int as count FROM product_files;`.then((r) => r[0]?.count ?? 0).catch(() => 0),
    sql`SELECT id, product_name, name, phone, created_at FROM product_enquiries ORDER BY created_at DESC LIMIT 5;`.catch(() => []),
    sql`SELECT id, name, phone, product, created_at FROM contact_enquiries ORDER BY created_at DESC LIMIT 5;`.catch(() => []),
  ]);

  const categories = getCatalogCategories();
  const totalProducts = catalogProducts.length;
  const totalCategories = categories.length;

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
          href="/admin/files"
          icon={CloudUploadRoundedIcon}
          subtext="Media assets in Neon"
          title="Product Files"
          value={productFilesCount}
        />
        <StatsCard
          icon={AdminPanelSettingsRoundedIcon}
          subtext="Authorized account"
          title="Admin Profile"
          value={admin.name.split(" ")[0]}
        />
      </div>

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
