import { useState } from "react";

const CATEGORIES = [
  { key: "interest",               label: "Interest",               color: "#60A5FA" },
  { key: "evaluation",             label: "Evaluation",             color: "#A78BFA" },
  { key: "problem",                label: "Problem",                color: "#F87171" },
  { key: "purchase_intent",        label: "Purchase Intent",        color: "#34D399" },
  { key: "price_sensitivity",      label: "Price Sensitivity",      color: "#FBBF24" },
  { key: "brand_affinity",         label: "Brand Affinity",         color: "#F472B6" },
  { key: "user_context",           label: "User Context",           color: "#94A3B8" },
  { key: "business_context",       label: "Business Context",       color: "#2DD4BF" },
  { key: "recommendation_request", label: "Recommendation",         color: "#FB923C" },
];

const pieData = [
  { name: "Interest",          value: 312, color: "#60A5FA" },
  { name: "Evaluation",        value: 198, color: "#A78BFA" },
  { name: "Problem",           value: 245, color: "#F87171" },
  { name: "Purchase Intent",   value: 89,  color: "#34D399" },
  { name: "Price Sensitivity", value: 134, color: "#FBBF24" },
  { name: "Brand Affinity",    value: 76,  color: "#F472B6" },
  { name: "User Context",      value: 167, color: "#94A3B8" },
  { name: "Business Context",  value: 143, color: "#2DD4BF" },
  { name: "Recommendation",    value: 211, color: "#FB923C" },
];

const trendData = [
  { day: "Mon", interest: 42, problem: 31, purchase_intent: 12, evaluation: 28 },
  { day: "Tue", interest: 55, problem: 38, purchase_intent: 9,  evaluation: 34 },
  { day: "Wed", interest: 48, problem: 29, purchase_intent: 15, evaluation: 41 },
  { day: "Thu", interest: 61, problem: 44, purchase_intent: 18, evaluation: 29 },
  { day: "Fri", interest: 39, problem: 33, purchase_intent: 11, evaluation: 36 },
  { day: "Sat", interest: 28, problem: 19, purchase_intent: 7,  evaluation: 22 },
  { day: "Sun", interest: 39, problem: 51, purchase_intent: 17, evaluation: 8  },
];

const CPM_RATES = {
  interest: 1.20, evaluation: 3.80, problem: 2.90, purchase_intent: 8.50,
  price_sensitivity: 5.20, brand_affinity: 4.10, user_context: 1.80,
  business_context: 6.40, recommendation_request: 4.60,
};

const totalSignals = pieData.reduce((s, d) => s + d.value, 0);

const revenueData = pieData.map(d => {
  const key = CATEGORIES.find(c => c.label === d.name)?.key || d.name.toLowerCase().replace(" ", "_");
  const cpm = CPM_RATES[key] || 2.0;
  const revenue = (d.value / 1000) * cpm;
  return { ...d, cpm, revenue, key };
}).sort((a, b) => b.revenue - a.revenue);

const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);

// ── Donut chart (pure SVG) ────────────────────────────────────────────────────

const DonutChart = ({ data, total, activeIndex, setActiveIndex }) => {
  const size = 180, cx = 90, cy = 90, outerR = 82, innerR = 52;
  let angle = -Math.PI / 2;

  const slices = data.map((d) => {
    const sweep = (d.value / total) * (2 * Math.PI - data.length * 0.02);
    const end = angle + sweep;
    const [c1, s1] = [Math.cos(angle), Math.sin(angle)];
    const [c2, s2] = [Math.cos(end),   Math.sin(end)];
    const large = sweep > Math.PI ? 1 : 0;
    const path = [
      `M ${cx + outerR * c1} ${cy + outerR * s1}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${cx + outerR * c2} ${cy + outerR * s2}`,
      `L ${cx + innerR * c2} ${cy + innerR * s2}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${cx + innerR * c1} ${cy + innerR * s1}`,
      "Z",
    ].join(" ");
    angle = end + 0.02;
    return { path, color: d.color };
  });

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color}
          opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
          onMouseEnter={() => setActiveIndex(i)}
          onMouseLeave={() => setActiveIndex(null)}
          style={{ cursor: "default", transition: "opacity 0.15s" }} />
      ))}
    </svg>
  );
};

// ── Line chart (pure SVG) ─────────────────────────────────────────────────────

const TREND_LINES = [
  { key: "interest",        color: "#60A5FA" },
  { key: "problem",         color: "#F87171" },
  { key: "evaluation",      color: "#A78BFA" },
  { key: "purchase_intent", color: "#34D399" },
];

const TrendChart = ({ data, height = 180 }) => {
  const W = 480, H = height;
  const ml = 28, mr = 8, mt = 8, mb = 22;
  const iW = W - ml - mr, iH = H - mt - mb;
  const n = data.length;
  const maxVal = Math.max(...data.flatMap(d => TREND_LINES.map(l => d[l.key])));
  const gx = i => ml + (i / (n - 1)) * iW;
  const gy = v => mt + iH - (v / maxVal) * iH;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={ml} x2={ml + iW}
          y1={mt + iH * (1 - f)} y2={mt + iH * (1 - f)}
          stroke="#1E2433" strokeDasharray="4 4" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={gx(i)} y={H - 4} textAnchor="middle"
          fill="#64748B" fontSize={11} fontFamily="monospace">{d.day}</text>
      ))}
      {[0, Math.round(maxVal * 0.5), maxVal].map((v, i) => (
        <text key={i} x={ml - 4} y={gy(v) + 4} textAnchor="end"
          fill="#64748B" fontSize={11} fontFamily="monospace">{v}</text>
      ))}
      {TREND_LINES.map(line => (
        <polyline key={line.key}
          points={data.map((d, i) => `${gx(i)},${gy(d[line.key])}`).join(" ")}
          fill="none" stroke={line.color} strokeWidth={2} strokeLinejoin="round" />
      ))}
    </svg>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

const card = {
  background: "#0D1117", border: "1px solid #1E2433",
  borderRadius: 10, padding: "24px",
};

export const SignalDashboard = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const maxBarVal = Math.max(...pieData.map(d => d.value));

  return (
    <div style={{
      background: "#080B12", color: "#E2E8F0",
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      padding: "32px", borderRadius: 12,
    }}>

      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, color: "#60A5FA", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
            ◈ Signal Analytics
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.02em", fontFamily: "inherit" }}>
            Conversation Signals
          </h1>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
            Last 7 days · {totalSignals.toLocaleString()} signals collected
          </div>
        </div>
        <div style={{
          background: "#0F1723", border: "1px solid #1E2D3D", borderRadius: 8,
          padding: "8px 16px", fontSize: 12, color: "#34D399",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399", display: "inline-block", boxShadow: "0 0 6px #34D399" }} />
          Live · REST v1
        </div>
      </div>

      {/* Stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Signals",   value: totalSignals.toLocaleString(), delta: "+12.4%", color: "#60A5FA" },
          { label: "Avg Confidence",  value: "0.81",     delta: "+0.03",  color: "#34D399" },
          { label: "Active Sessions", value: "1,204",    delta: "+8.1%",  color: "#A78BFA" },
          { label: "Top Category",    value: "Interest", delta: "31.8%",  color: "#FBBF24" },
        ].map((stat, i) => (
          <div key={i} style={{ ...card }}>
            <div style={{ fontSize: 11, color: "#64748B", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: stat.color, letterSpacing: "-0.02em" }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: "#34D399", marginTop: 4 }}>↑ {stat.delta}</div>
          </div>
        ))}
      </div>

      {/* Donut + Line */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, marginBottom: 20 }}>

        <div style={card}>
          <div style={{ fontSize: 12, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            Category Distribution
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <DonutChart data={pieData} total={totalSignals} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              {pieData.map((d, i) => (
                <div key={i}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 6px", borderRadius: 4, background: activeIndex === i ? "#1E2433" : "transparent", cursor: "default", transition: "background 0.15s" }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: "#94A3B8", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</span>
                  <span style={{ fontSize: 11, color: "#E2E8F0", fontWeight: 600 }}>{((d.value / totalSignals) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={card}>
          <div style={{ fontSize: 12, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            Signal Trend · Top 4 Categories
          </div>
          <TrendChart data={trendData} height={180} />
        </div>
      </div>

      {/* Bar + Revenue */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>

        <div style={card}>
          <div style={{ fontSize: 12, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            Volume by Category
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, color: "#94A3B8", width: 110, flexShrink: 0, textAlign: "right" }}>{d.name}</span>
                <div style={{ flex: 1, height: 10, background: "#1E2433", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(d.value / maxBarVal) * 100}%`, background: d.color, borderRadius: "0 2px 2px 0" }} />
                </div>
                <span style={{ fontSize: 11, color: "#64748B", width: 32, textAlign: "right" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Est. Ad Revenue · CPM
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#34D399", letterSpacing: "-0.02em" }}>${totalRevenue.toFixed(2)}</div>
              <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>this period</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {revenueData.map((d, i) => {
              const pct = (d.revenue / totalRevenue) * 100;
              return (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "#94A3B8", flex: 1 }}>{d.name}</span>
                    <span style={{ fontSize: 10, color: "#475569" }}>${d.cpm.toFixed(2)} CPM</span>
                    <span style={{ fontSize: 12, color: "#E2E8F0", fontWeight: 600, width: 48, textAlign: "right" }}>${d.revenue.toFixed(2)}</span>
                  </div>
                  <div style={{ height: 4, background: "#1E2433", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: d.color, borderRadius: 2, transition: "width 0.8s ease", opacity: 0.85 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16, padding: "10px 12px", background: "#0A0E16", borderRadius: 6, border: "1px solid #1A2030", fontSize: 10, color: "#475569", lineHeight: 1.6 }}>
            CPM rates reflect signal commercial value.{" "}
            <span style={{ color: "#34D399" }}>purchase_intent</span> and{" "}
            <span style={{ color: "#2DD4BF" }}>business_context</span> yield highest revenue per 1k signals.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 24, fontSize: 10, color: "#334155", textAlign: "center", letterSpacing: "0.08em" }}>
        SIGNAL COLLECTION ENGINE · REST v1 · SAMPLE DATA
      </div>
    </div>
  );
}
