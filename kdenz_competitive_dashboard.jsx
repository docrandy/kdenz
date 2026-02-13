import React, { useState } from "react";

const COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  accent: "#06b6d4",
  danger: "#ef4444",
  warning: "#f59e0b",
  success: "#10b981",
  muted: "#94a3b8",
  bg: "#0f172a",
  card: "#1e293b",
  cardLight: "#334155",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  white: "#ffffff",
};

const THREAT_COLORS = { 5: "#ef4444", 4: "#f97316", 3: "#f59e0b", 2: "#22d3ee", 1: "#94a3b8" };

const competitors = [
  { name: "Yoodli", category: "Speech Coaching", threat: 4, xAxis: 25, yAxis: 85 },
  { name: "Orai", category: "Speech Coaching", threat: 3, xAxis: 30, yAxis: 75 },
  { name: "Poised", category: "Speech Coaching", threat: 4, xAxis: 35, yAxis: 90 },
  { name: "Speeko", category: "Speech Coaching", threat: 2, xAxis: 15, yAxis: 70 },
  { name: "Gong", category: "Conversation Intelligence", threat: 2, xAxis: 90, yAxis: 25 },
  { name: "Chorus.ai", category: "Conversation Intelligence", threat: 2, xAxis: 85, yAxis: 20 },
  { name: "Jiminny", category: "Conversation Intelligence", threat: 1, xAxis: 75, yAxis: 30 },
  { name: "Nooks", category: "Conversation Intelligence", threat: 2, xAxis: 80, yAxis: 80 },
  { name: "Kintsugi", category: "Vocal Biomarkers", threat: 3, xAxis: 70, yAxis: 15 },
  { name: "Canary Speech", category: "Vocal Biomarkers", threat: 3, xAxis: 75, yAxis: 10 },
  { name: "Sonde Health", category: "Vocal Biomarkers", threat: 3, xAxis: 40, yAxis: 65 },
  { name: "Tough Tongue AI", category: "AI Roleplay", threat: 4, xAxis: 30, yAxis: 80 },
  { name: "Hyperbound", category: "AI Roleplay", threat: 3, xAxis: 70, yAxis: 75 },
  { name: "Persway", category: "AI Roleplay", threat: 3, xAxis: 20, yAxis: 70 },
  { name: "Insight7", category: "AI Roleplay", threat: 2, xAxis: 80, yAxis: 20 },
  { name: "BetterUp", category: "AI Coaching", threat: 1, xAxis: 85, yAxis: 35 },
  { name: "CoachHub", category: "AI Coaching", threat: 1, xAxis: 82, yAxis: 40 },
];

const featureData = [
  { feature: "Real-Time Feedback", count: 8, competitors: "Yoodli, Orai, Poised, Speeko, Sonde, Tough Tongue, Hyperbound, Persway" },
  { feature: "Post-Session Report", count: 7, competitors: "Yoodli, Orai, Poised, Gong, Chorus, Jiminny, Insight7" },
  { feature: "Filler Word Detection", count: 5, competitors: "Yoodli, Orai, Poised, Speeko, Tough Tongue" },
  { feature: "Progress Tracking", count: 5, competitors: "Yoodli, Orai, Poised, Speeko, Gong" },
  { feature: "Roleplay / Practice", count: 5, competitors: "Yoodli, Tough Tongue, Hyperbound, Persway, Nooks" },
  { feature: "Pacing / Tempo", count: 4, competitors: "Yoodli, Orai, Poised, Speeko" },
  { feature: "Sentiment Analysis", count: 4, competitors: "Gong, Kintsugi, Canary, Insight7" },
  { feature: "Sales Call Analysis", count: 4, competitors: "Gong, Chorus, Jiminny, Nooks" },
  { feature: "Meeting Integration", count: 3, competitors: "Poised, Gong, Chorus" },
  { feature: "Emotion Detection", count: 3, competitors: "Kintsugi, Canary, Sonde" },
  { feature: "Mobile App", count: 3, competitors: "Orai, Speeko, Persway" },
  { feature: "API Available", count: 3, competitors: "Kintsugi, Canary, Sonde" },
  { feature: "Pitch / Intonation", count: 3, competitors: "Yoodli, Orai, Hyperbound" },
  { feature: "Negotiation Scenarios", count: 2, competitors: "Tough Tongue, Persway" },
  { feature: "Video / Body Language", count: 2, competitors: "Yoodli, Tough Tongue" },
  { feature: "HIPAA Compliant", count: 2, competitors: "Kintsugi, Canary" },
  { feature: "Difficult Convo Practice", count: 1, competitors: "Tough Tongue (partial)" },
  { feature: "Browser Extension", count: 1, competitors: "Poised only" },
  { feature: "Team/Manager Dashboard", count: 1, competitors: "Gong only" },
  { feature: "White-Label / OEM", count: 0, competitors: "NONE" },
  { feature: "Custom Scoring Criteria", count: 1, competitors: "Insight7 only" },
  { feature: "Clinical Validation", count: 2, competitors: "Kintsugi, Canary" },
];

const pricingData = [
  { tier: "Free Tier", range: "$0", min: 0, max: 0, count: 4, competitors: "Yoodli, Poised, Speeko, Tough Tongue" },
  { tier: "Consumer", range: "$8-20/mo", min: 8, max: 20, count: 5, competitors: "Yoodli, Poised, Speeko, Tough Tongue, Persway" },
  { tier: "⭐ KDENZ Gap", range: "$20-100/mo", min: 20, max: 100, count: 0, competitors: "ZERO competitors", isGap: true },
  { tier: "Enterprise", range: "$108-240/mo", min: 108, max: 240, count: 2, competitors: "Gong, Chorus" },
];

const messagingAngles = [
  { angle: "AI-Powered / AI-Driven", used: 5, status: "saturated" },
  { angle: "Coaching / Training", used: 4, status: "saturated" },
  { angle: "Roleplay / Practice", used: 3, status: "moderate" },
  { angle: "Real-Time Feedback", used: 2, status: "moderate" },
  { angle: "Private / Judgment-Free", used: 2, status: "moderate" },
  { angle: "Difficult Conversations", used: 0, status: "whitespace" },
  { angle: "Negotiation Mastery", used: 0, status: "whitespace" },
  { angle: "Motivational Interviewing", used: 0, status: "whitespace" },
  { angle: "Clinical-Grade Voice", used: 0, status: "whitespace" },
  { angle: "Behavioral Science", used: 0, status: "whitespace" },
  { angle: "Post-Convo Reflection", used: 0, status: "whitespace" },
  { angle: "Conflict De-escalation", used: 0, status: "whitespace" },
];

const CATEGORY_COLORS = {
  "Speech Coaching": "#6366f1",
  "Conversation Intelligence": "#06b6d4",
  "Vocal Biomarkers": "#10b981",
  "AI Roleplay": "#f59e0b",
  "AI Coaching": "#94a3b8",
};

const tabs = [
  { id: "quadrant", label: "Market Map" },
  { id: "threat", label: "Threat Heatmap" },
  { id: "features", label: "Feature Gaps" },
  { id: "pricing", label: "Pricing Gap" },
  { id: "messaging", label: "Messaging" },
  { id: "strategy", label: "Strategy" },
];

function QuadrantChart() {
  const [hovered, setHovered] = useState(null);
  const w = 600, h = 480, pad = 60;

  return (
    <div>
      <p style={{ color: COLORS.textMuted, marginBottom: 16, fontSize: 14 }}>
        Each dot is a competitor. The green zone (bottom-left) shows where ZERO competitors exist — Consumer + Post-Hoc analysis.
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: 700 }}>
        <defs>
          <linearGradient id="whitespaceBg" x1="0%" y1="100%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x={pad} y={pad} width={w - 2 * pad} height={h - 2 * pad} fill="#1e293b" rx={8} />
        <rect x={pad} y={(h) / 2} width={(w - 2 * pad) / 2} height={(h - 2 * pad) / 2} fill="url(#whitespaceBg)" />
        <line x1={w / 2} y1={pad} x2={w / 2} y2={h - pad} stroke="#475569" strokeDasharray="4" />
        <line x1={pad} y1={h / 2} x2={w - pad} y2={h / 2} stroke="#475569" strokeDasharray="4" />
        <text x={w / 2} y={h - 10} textAnchor="middle" fill={COLORS.textMuted} fontSize={11}>Consumer ← → Enterprise</text>
        <text x={12} y={h / 2} textAnchor="middle" fill={COLORS.textMuted} fontSize={11} transform={`rotate(-90 12 ${h / 2})`}>Post-Hoc ← → Real-Time</text>
        <text x={pad + 60} y={pad + 20} fill="#475569" fontSize={10}>Q1: Consumer + Real-Time (7)</text>
        <text x={w / 2 + 20} y={pad + 20} fill="#475569" fontSize={10}>Q2: Enterprise + Real-Time (2)</text>
        <text x={pad + 20} y={h - pad - 10} fill="#10b981" fontSize={11} fontWeight="bold">Q3: ⭐ WHITE SPACE (0)</text>
        <text x={w / 2 + 20} y={h - pad - 10} fill="#475569" fontSize={10}>Q4: Enterprise + Post-Hoc (8)</text>

        {competitors.map((c, i) => {
          const cx = pad + (c.xAxis / 100) * (w - 2 * pad);
          const cy = pad + ((100 - c.yAxis) / 100) * (h - 2 * pad);
          const r = 6 + c.threat * 2;
          const isHovered = hovered === i;
          return (
            <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              <circle cx={cx} cy={cy} r={isHovered ? r + 3 : r} fill={CATEGORY_COLORS[c.category]} opacity={isHovered ? 1 : 0.8} stroke={isHovered ? COLORS.white : "none"} strokeWidth={2} />
              <text x={cx} y={cy - r - 4} textAnchor="middle" fill={COLORS.text} fontSize={9} fontWeight={c.threat >= 4 ? "bold" : "normal"}>
                {c.name}
              </text>
              {isHovered && (
                <g>
                  <rect x={cx - 80} y={cy + r + 6} width={160} height={36} fill="#0f172a" rx={4} opacity={0.95} />
                  <text x={cx} y={cy + r + 22} textAnchor="middle" fill={COLORS.text} fontSize={10}>{c.category}</text>
                  <text x={cx} y={cy + r + 36} textAnchor="middle" fill={THREAT_COLORS[c.threat]} fontSize={10} fontWeight="bold">Threat: {c.threat}/5</text>
                </g>
              )}
            </g>
          );
        })}

        {/* KDENZ target zone */}
        <circle cx={pad + 0.3 * (w - 2 * pad)} cy={pad + 0.65 * (h - 2 * pad)} r={28} fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray="6" />
        <text x={pad + 0.3 * (w - 2 * pad)} y={pad + 0.65 * (h - 2 * pad) + 4} textAnchor="middle" fill="#10b981" fontSize={10} fontWeight="bold">KDENZ</text>
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12 }}>
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThreatHeatmap() {
  const categories = ["Speech Coaching", "AI Roleplay", "Vocal Biomarkers", "Conversation Intelligence", "AI Coaching"];
  const grouped = {};
  categories.forEach(c => { grouped[c] = competitors.filter(x => x.category === c).sort((a, b) => b.threat - a.threat); });

  const tierOneThreats = [
    { name: "Yoodli", threat: 4, danger: "Google-backed with SOC2/GDPR, strong brand via Toastmasters partnerships. Category leader for speech coaching.", weakness: "Privacy concerns — free tier data used for AI training. Generic feedback that doesn't adapt to conversation context." },
    { name: "Poised", threat: 4, danger: "Only competitor with browser extension for ambient meeting capture. Seamless Zoom/Teams/Meet overlay.", weakness: "Technical reliability issues (broken recordings, camera tracking). Limited to meetings — no practice modes." },
    { name: "Tough Tongue AI", threat: 4, danger: "Fully agentic voice AI with multimodal (voice + video + whiteboard). Directly targets difficult conversations and negotiations.", weakness: "Early-stage prototype with limited traction. No clinical validation or behavioral science backing." },
  ];

  return (
    <div>
      <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        {categories.map(cat => (
          <div key={cat} style={{ background: COLORS.card, borderRadius: 8, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: CATEGORY_COLORS[cat] }} />
              <span style={{ fontWeight: 600, color: COLORS.text, fontSize: 14 }}>{cat}</span>
              <span style={{ color: COLORS.textMuted, fontSize: 12 }}>({grouped[cat]?.length || 0})</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(grouped[cat] || []).map(c => (
                <div key={c.name} style={{
                  background: THREAT_COLORS[c.threat] + "22",
                  border: `1px solid ${THREAT_COLORS[c.threat]}`,
                  borderRadius: 6, padding: "6px 12px",
                  display: "flex", alignItems: "center", gap: 6
                }}>
                  <span style={{ fontSize: 13, color: COLORS.text }}>{c.name}</span>
                  <span style={{
                    background: THREAT_COLORS[c.threat], color: "#fff",
                    borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 700
                  }}>{c.threat}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ color: COLORS.danger, fontSize: 16, marginBottom: 12 }}>Tier 1 Threats (4-5) — Deep Dive</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {tierOneThreats.map(t => (
          <div key={t.name} style={{ background: COLORS.card, borderRadius: 8, padding: 16, borderLeft: `3px solid ${THREAT_COLORS[t.threat]}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: COLORS.text, fontSize: 15 }}>{t.name}</span>
              <span style={{ background: THREAT_COLORS[t.threat], color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>Threat {t.threat}/5</span>
            </div>
            <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "0 0 6px" }}>⚡ <strong style={{ color: COLORS.text }}>Dangerous because:</strong> {t.danger}</p>
            <p style={{ color: COLORS.textMuted, fontSize: 13, margin: 0 }}>🎯 <strong style={{ color: COLORS.text }}>Weakness:</strong> {t.weakness}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureChart() {
  const maxCount = 8;
  const saturated = featureData.filter(f => f.count >= 4);
  const whitespace = featureData.filter(f => f.count <= 1);

  return (
    <div>
      <h3 style={{ color: COLORS.text, fontSize: 16, marginBottom: 4 }}>Most Common Features (Saturated)</h3>
      <p style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 12 }}>These are table stakes — not differentiators</p>
      <div style={{ display: "grid", gap: 6, marginBottom: 28 }}>
        {saturated.map(f => (
          <div key={f.feature} style={{ display: "grid", gridTemplateColumns: "180px 1fr 30px", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: COLORS.text, textAlign: "right" }}>{f.feature}</span>
            <div style={{ height: 20, background: COLORS.cardLight, borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${(f.count / maxCount) * 100}%`,
                background: f.count >= 6 ? COLORS.danger : f.count >= 4 ? COLORS.warning : COLORS.accent,
                borderRadius: 4, transition: "width 0.5s"
              }} />
            </div>
            <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>{f.count}</span>
          </div>
        ))}
      </div>

      <h3 style={{ color: COLORS.success, fontSize: 16, marginBottom: 4 }}>Differentiation Opportunities (0-1 Competitors)</h3>
      <p style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 12 }}>KDENZ can own these features</p>
      <div style={{ display: "grid", gap: 6 }}>
        {whitespace.map(f => (
          <div key={f.feature} style={{ display: "grid", gridTemplateColumns: "180px 1fr 30px", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: COLORS.success, fontWeight: f.count === 0 ? 700 : 400, textAlign: "right" }}>
              {f.count === 0 ? "⭐ " : ""}{f.feature}
            </span>
            <div style={{ height: 20, background: COLORS.cardLight, borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: f.count === 0 ? "3%" : `${(f.count / maxCount) * 100}%`,
                background: f.count === 0 ? COLORS.success : "#10b98180",
                borderRadius: 4
              }} />
            </div>
            <span style={{ fontSize: 12, color: f.count === 0 ? COLORS.success : COLORS.textMuted, fontWeight: 600 }}>{f.count}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, background: "#10b98115", border: "1px solid #10b98140", borderRadius: 8, padding: 12 }}>
        <p style={{ color: COLORS.success, fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>Recommended Feature Stack to Own</p>
        <p style={{ color: COLORS.textMuted, fontSize: 12, margin: 0 }}>
          White-Label/OEM (zero competition) + Post-conversation analysis (empty quadrant) + Team/Manager Dashboard (only Gong, enterprise-only) + Browser Extension (only Poised, real-time focus) + Custom Scoring Criteria (only Insight7)
        </p>
      </div>
    </div>
  );
}

function PricingChart() {
  const maxPrice = 250;
  return (
    <div>
      <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 16 }}>
        There's an $88/month gap between consumer tools ($20 max) and enterprise platforms ($108+ min). Nobody serves the $20-100 range.
      </p>
      <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        {pricingData.map(p => (
          <div key={p.tier} style={{
            background: p.isGap ? "#10b98115" : COLORS.card,
            border: p.isGap ? "2px solid #10b981" : `1px solid ${COLORS.cardLight}`,
            borderRadius: 8, padding: 14
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: p.isGap ? COLORS.success : COLORS.text, fontSize: 14 }}>{p.tier}</span>
              <span style={{ color: COLORS.textMuted, fontSize: 12 }}>{p.count} competitors</span>
            </div>
            <div style={{ height: 24, background: COLORS.cardLight, borderRadius: 4, position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute",
                left: `${(p.min / maxPrice) * 100}%`,
                width: `${Math.max(((p.max - p.min) / maxPrice) * 100, 2)}%`,
                height: "100%",
                background: p.isGap ? COLORS.success : p.count === 0 ? COLORS.success : COLORS.primary,
                borderRadius: 4,
                opacity: p.isGap ? 0.6 : 0.8
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>{p.range}</span>
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>{p.competitors}</span>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ color: COLORS.text, fontSize: 16, marginBottom: 12 }}>Recommended KDENZ Pricing</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { tier: "Free", price: "$0/mo", purpose: "Lead gen", features: "3 analyses/mo, basic metrics, read-only library" },
          { tier: "Professional", price: "$49/mo", purpose: "Individual power users", features: "Unlimited analyses, full library, browser extension, progress tracking" },
          { tier: "Team", price: "$79/user/mo", purpose: "Fills the gap", features: "Manager dashboard, shared libraries, custom scoring, role scenarios" },
        ].map(t => (
          <div key={t.tier} style={{
            background: COLORS.card, borderRadius: 8, padding: 14,
            border: t.tier === "Team" ? "2px solid #10b981" : `1px solid ${COLORS.cardLight}`
          }}>
            <div style={{ color: t.tier === "Team" ? COLORS.success : COLORS.accent, fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{t.tier}</div>
            <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 22, marginBottom: 4 }}>{t.price}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 6 }}>{t.purpose}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 11 }}>{t.features}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagingChart() {
  return (
    <div>
      <h3 style={{ color: COLORS.text, fontSize: 16, marginBottom: 12 }}>Value Prop Saturation vs White Space</h3>
      <div style={{ display: "grid", gap: 6, marginBottom: 24 }}>
        {messagingAngles.map(m => (
          <div key={m.angle} style={{ display: "grid", gridTemplateColumns: "200px 1fr 50px", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 12, textAlign: "right",
              color: m.status === "whitespace" ? COLORS.success : m.status === "saturated" ? COLORS.danger : COLORS.text,
              fontWeight: m.status === "whitespace" ? 700 : 400
            }}>
              {m.status === "whitespace" ? "⭐ " : ""}{m.angle}
            </span>
            <div style={{ height: 18, background: COLORS.cardLight, borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: m.used === 0 ? "0%" : `${(m.used / 5) * 100}%`,
                background: m.status === "saturated" ? COLORS.danger : m.status === "moderate" ? COLORS.warning : COLORS.success,
                borderRadius: 4
              }} />
            </div>
            <span style={{ fontSize: 11, color: COLORS.textMuted }}>
              {m.used === 0 ? "OPEN" : `${m.used}/5 use`}
            </span>
          </div>
        ))}
      </div>

      <div style={{ background: "#6366f115", border: "1px solid #6366f140", borderRadius: 8, padding: 16 }}>
        <p style={{ color: COLORS.primary, fontWeight: 700, fontSize: 14, margin: "0 0 8px" }}>Recommended Hero Copy</p>
        <p style={{ color: COLORS.text, fontSize: 20, fontWeight: 700, fontStyle: "italic", margin: "0 0 6px" }}>
          "Master the conversations that matter most"
        </p>
        <p style={{ color: COLORS.textMuted, fontSize: 14, fontStyle: "italic", margin: "0 0 12px" }}>
          Evidence-based voice coaching for difficult conversations, negotiations, and high-stakes moments
        </p>
        <p style={{ color: COLORS.textMuted, fontSize: 12, margin: 0 }}>
          Why: Directly owns "difficult conversations" (zero competition), emphasizes behavioral science credibility (unique to KDENZ from your MI training), avoids commoditized "AI-powered" lead
        </p>
      </div>
    </div>
  );
}

function StrategyView() {
  return (
    <div>
      <h3 style={{ color: COLORS.text, fontSize: 18, marginBottom: 16 }}>KDENZ Voice Lab — Strategic Positioning Summary</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Market Position", value: "Consumer + Post-Hoc", detail: "The only empty quadrant — zero competitors", color: COLORS.success },
          { label: "Price Position", value: "$49-79/mo", detail: "Fills the $88 gap between consumer and enterprise", color: COLORS.accent },
          { label: "Messaging Position", value: "Difficult Conversations", detail: "Zero competitors messaging this angle", color: COLORS.primary },
        ].map(s => (
          <div key={s.label} style={{ background: COLORS.card, borderRadius: 8, padding: 16, borderTop: `3px solid ${s.color}` }}>
            <div style={{ color: COLORS.textMuted, fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{s.detail}</div>
          </div>
        ))}
      </div>

      <h4 style={{ color: COLORS.text, fontSize: 15, marginBottom: 10 }}>Defensible Feature Moat</h4>
      <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
        {[
          { feature: "White-Label / OEM", competition: "0 competitors", impact: "B2B2C revenue stream" },
          { feature: "Post-Conversation Analysis (Consumer)", competition: "0 in this quadrant", impact: "Core product differentiator" },
          { feature: "Team/Manager Dashboard", competition: "Only Gong (enterprise-only)", impact: "Unlocks team pricing tier" },
          { feature: "Browser Extension", competition: "Only Poised (real-time focus)", impact: "Ambient capture delivery mechanism" },
          { feature: "Custom Scoring Criteria", competition: "Only Insight7", impact: "Enables MI-based coaching frameworks" },
          { feature: "Behavioral Science Framework", competition: "0 competitors", impact: "Your MI training + compression theory = unique moat" },
        ].map((f, i) => (
          <div key={i} style={{ background: COLORS.card, borderRadius: 6, padding: 12, display: "grid", gridTemplateColumns: "1.5fr 1fr 1.5fr", gap: 12, alignItems: "center" }}>
            <span style={{ color: COLORS.text, fontSize: 13, fontWeight: 600 }}>{f.feature}</span>
            <span style={{ color: COLORS.success, fontSize: 12 }}>{f.competition}</span>
            <span style={{ color: COLORS.textMuted, fontSize: 12 }}>{f.impact}</span>
          </div>
        ))}
      </div>

      <h4 style={{ color: COLORS.text, fontSize: 15, marginBottom: 10 }}>Tier 1 Threat Counterplay</h4>
      <div style={{ display: "grid", gap: 8 }}>
        {[
          { vs: "vs Yoodli", attack: "They lead on filler detection. You lead on WHY it matters — behavioral context, not just metrics. Their privacy issues are your trust advantage." },
          { vs: "vs Poised", attack: "They own real-time meeting overlay. You own post-conversation depth analysis. Different delivery timing, complementary not competitive." },
          { vs: "vs Tough Tongue AI", attack: "They do roleplay simulations. You do real conversation analysis. They're practice; you're the game. Your MI training gives clinical credibility they lack." },
        ].map((t, i) => (
          <div key={i} style={{ background: COLORS.card, borderRadius: 6, padding: 12, borderLeft: `3px solid ${COLORS.warning}` }}>
            <span style={{ color: COLORS.warning, fontWeight: 700, fontSize: 13 }}>{t.vs}</span>
            <p style={{ color: COLORS.textMuted, fontSize: 12, margin: "4px 0 0" }}>{t.attack}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("quadrant");

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px", background: "linear-gradient(135deg, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            KDENZ Voice Lab
          </h1>
          <p style={{ color: COLORS.textMuted, fontSize: 13, margin: 0 }}>Competitive Intelligence Dashboard — 17 competitors across 5 categories</p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                background: activeTab === t.id ? COLORS.primary : COLORS.card,
                color: activeTab === t.id ? COLORS.white : COLORS.textMuted,
                transition: "all 0.2s"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ background: COLORS.card, borderRadius: 12, padding: 20 }}>
          {activeTab === "quadrant" && <QuadrantChart />}
          {activeTab === "threat" && <ThreatHeatmap />}
          {activeTab === "features" && <FeatureChart />}
          {activeTab === "pricing" && <PricingChart />}
          {activeTab === "messaging" && <MessagingChart />}
          {activeTab === "strategy" && <StrategyView />}
        </div>
      </div>
    </div>
  );
}
