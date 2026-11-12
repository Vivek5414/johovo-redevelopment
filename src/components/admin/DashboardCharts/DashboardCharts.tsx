"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import styles from "./DashboardCharts.module.css";

export type DashboardChartsProps = {
  distributionData: { name: string; value: number; color: string }[];
  categoryData: { name: string; count: number }[];
  timelineData: { day: string; enquiries: number; interactions: number }[];
  revenueData: { day: string; revenue: number }[];
  productInterestData: { name: string; enquiries: number }[];
  deviceData: { name: string; value: number; color: string }[];
  pageTrafficData: { page: string; count: number }[];
  paymentModeData: { name: string; value: number; color: string }[];
};

export function DashboardCharts({
  distributionData,
  categoryData,
  timelineData,
  revenueData,
  productInterestData,
  deviceData,
  pageTrafficData,
  paymentModeData,
}: DashboardChartsProps) {
  const totalInteractions = distributionData.reduce((acc, it) => acc + it.value, 0);
  const totalDeviceClicks = deviceData.reduce((acc, it) => acc + it.value, 0);
  const totalRevenue = revenueData.reduce((acc, it) => acc + it.revenue, 0);
  const totalPaymentModes = paymentModeData.reduce((acc, it) => acc + it.value, 0);

  return (
    <div className={styles.chartsGrid}>
      {/* 1. Lead & Interaction Distribution Donut/Pie Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Lead &amp; Interaction Distribution</h3>
            <p className={styles.chartDesc}>Actual shares from enquiries, WhatsApp &amp; phone calls</p>
          </div>
          <span className={styles.totalBadge}>Total: {totalInteractions}</span>
        </div>

        <div className={styles.chartBody}>
          {totalInteractions > 0 ? (
            <ResponsiveContainer height={260} width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={distributionData}
                  dataKey="value"
                  innerRadius={60}
                  nameKey="name"
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {distributionData.map((entry, index) => (
                    <Cell fill={entry.color} key={`cell-${index}`} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface, #ffffff)",
                    borderColor: "var(--color-border, #e2e8f0)",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(val: any) => [`${val} records`, "Total"]}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "var(--color-text-main, #2d3748)", fontSize: "0.8rem", fontWeight: 500 }}>
                      {value}
                    </span>
                  )}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyState}>No interaction records in database yet.</div>
          )}
        </div>
      </div>

      {/* 2. Device & Machine Breakdown (Pie Chart) */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Visitor Platform &amp; Device Breakdown</h3>
            <p className={styles.chartDesc}>Detected hardware / OS from WhatsApp &amp; Call trackers</p>
          </div>
          <span className={styles.totalBadge}>Logged: {totalDeviceClicks}</span>
        </div>

        <div className={styles.chartBody}>
          {totalDeviceClicks > 0 ? (
            <ResponsiveContainer height={260} width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={deviceData}
                  dataKey="value"
                  innerRadius={55}
                  nameKey="name"
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {deviceData.map((entry, index) => (
                    <Cell fill={entry.color} key={`cell-device-${index}`} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface, #ffffff)",
                    borderColor: "var(--color-border, #e2e8f0)",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                  }}
                  formatter={(val: any) => [`${val} users`, "Visitors"]}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "var(--color-text-main, #2d3748)", fontSize: "0.8rem", fontWeight: 500 }}>
                      {value}
                    </span>
                  )}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyState}>No device click logs stored in database yet.</div>
          )}
        </div>
      </div>

      {/* 3. Daily Activity & Inbound Leads (Area Timeline Chart) */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>7-Day Inbound Trends</h3>
            <p className={styles.chartDesc}>Actual customer inquiries vs action clicks per day</p>
          </div>
        </div>

        <div className={styles.chartBody}>
          <ResponsiveContainer height={260} width="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEnq" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#2e6443" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2e6443" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorInt" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f0f4f1" strokeDasharray="3 3" />
              <XAxis dataKey="day" style={{ fontSize: "0.75rem", fill: "var(--color-text-secondary)" }} />
              <YAxis allowDecimals={false} style={{ fontSize: "0.75rem", fill: "var(--color-text-secondary)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface, #ffffff)",
                  borderColor: "var(--color-border, #e2e8f0)",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                dataKey="enquiries"
                fill="url(#colorEnq)"
                fillOpacity={1}
                name="Leads & Enquiries"
                stroke="#2e6443"
                strokeWidth={2}
                type="monotone"
              />
              <Area
                dataKey="interactions"
                fill="url(#colorInt)"
                fillOpacity={1}
                name="Clicks & Calls"
                stroke="#d97706"
                strokeWidth={2}
                type="monotone"
              />
              <Legend
                formatter={(val) => <span style={{ fontSize: "0.8rem", color: "var(--color-text-main)" }}>{val}</span>}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Most Inquired Herbal Products (Bar Chart) */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Most Inquired Products</h3>
            <p className={styles.chartDesc}>Actual customer demand per product formulation</p>
          </div>
        </div>

        <div className={styles.chartBody}>
          {productInterestData.length > 0 ? (
            <ResponsiveContainer height={260} width="100%">
              <BarChart data={productInterestData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid stroke="#f0f4f1" strokeDasharray="3 3" />
                <XAxis allowDecimals={false} style={{ fontSize: "0.75rem" }} type="number" />
                <YAxis dataKey="name" style={{ fontSize: "0.72rem", fill: "var(--color-text-main)" }} type="category" width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface, #ffffff)",
                    borderColor: "var(--color-border, #e2e8f0)",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                  }}
                  formatter={(val: any) => [`${val} enquiries`, "Volume"]}
                />
                <Bar dataKey="enquiries" fill="#2e6443" name="Customer Enquiries" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyState}>No product enquiries submitted yet.</div>
          )}
        </div>
      </div>

      {/* 5. Invoiced Revenue Trend (Bar Chart) */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Invoiced Revenue (Last 7 Days)</h3>
            <p className={styles.chartDesc}>Actual billing totals recorded in database</p>
          </div>
          <span className={styles.totalBadge}>₹{totalRevenue.toLocaleString("en-IN")}</span>
        </div>

        <div className={styles.chartBody}>
          <ResponsiveContainer height={260} width="100%">
            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#f0f4f1" strokeDasharray="3 3" />
              <XAxis dataKey="day" style={{ fontSize: "0.75rem", fill: "var(--color-text-secondary)" }} />
              <YAxis
                style={{ fontSize: "0.72rem", fill: "var(--color-text-secondary)" }}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface, #ffffff)",
                  borderColor: "var(--color-border, #e2e8f0)",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Billed Amount"]}
              />
              <Bar dataKey="revenue" fill="#be185d" name="Billed (₹)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. Payment Modes in Generated Receipts (Pie Chart) */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Payment Method Preferences</h3>
            <p className={styles.chartDesc}>Actual payment modes recorded across issued receipts</p>
          </div>
          <span className={styles.totalBadge}>Invoices: {totalPaymentModes}</span>
        </div>

        <div className={styles.chartBody}>
          {totalPaymentModes > 0 ? (
            <ResponsiveContainer height={260} width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={paymentModeData}
                  dataKey="value"
                  innerRadius={55}
                  nameKey="name"
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {paymentModeData.map((entry, index) => (
                    <Cell fill={entry.color} key={`cell-pm-${index}`} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface, #ffffff)",
                    borderColor: "var(--color-border, #e2e8f0)",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                  }}
                  formatter={(val: any) => [`${val} orders`, "Receipts"]}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "var(--color-text-main, #2d3748)", fontSize: "0.8rem", fontWeight: 500 }}>
                      {value}
                    </span>
                  )}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyState}>No receipts saved with payment methods yet.</div>
          )}
        </div>
      </div>

      {/* 7. Product Catalog Taxonomy Breakdown (Bar Chart) */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Catalog Taxonomy by Category</h3>
            <p className={styles.chartDesc}>Distribution of formulas across store categories</p>
          </div>
        </div>

        <div className={styles.chartBody}>
          <ResponsiveContainer height={250} width="100%">
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid stroke="#f0f4f1" strokeDasharray="3 3" />
              <XAxis
                angle={-15}
                dataKey="name"
                interval={0}
                style={{ fontSize: "0.72rem", fill: "var(--color-text-secondary)" }}
                textAnchor="end"
              />
              <YAxis allowDecimals={false} style={{ fontSize: "0.75rem", fill: "var(--color-text-secondary)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface, #ffffff)",
                  borderColor: "var(--color-border, #e2e8f0)",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                }}
                formatter={(val: any) => [`${val} Products`, "Catalog Count"]}
              />
              <Bar dataKey="count" fill="var(--color-herbal-forest, #2e6443)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 8. Top Pages Generating WhatsApp/Call Leads (Bar Chart) */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Top Lead Generating Pages</h3>
            <p className={styles.chartDesc}>Pages where visitors click to WhatsApp or Call</p>
          </div>
        </div>

        <div className={styles.chartBody}>
          {pageTrafficData.length > 0 ? (
            <ResponsiveContainer height={250} width="100%">
              <BarChart data={pageTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid stroke="#f0f4f1" strokeDasharray="3 3" />
                <XAxis
                  angle={-15}
                  dataKey="page"
                  interval={0}
                  style={{ fontSize: "0.72rem", fill: "var(--color-text-secondary)" }}
                  textAnchor="end"
                />
                <YAxis allowDecimals={false} style={{ fontSize: "0.75rem", fill: "var(--color-text-secondary)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface, #ffffff)",
                    borderColor: "var(--color-border, #e2e8f0)",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                  }}
                  formatter={(val: any) => [`${val} clicks`, "Engagements"]}
                />
                <Bar dataKey="count" fill="#d97706" name="Clicks" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyState}>No page clicks tracked yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
