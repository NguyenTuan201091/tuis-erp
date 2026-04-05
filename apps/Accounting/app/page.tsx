const quickLinks = [
  { label: "Health Check", href: "/api/health", description: "Module health and uptime" },
  { label: "OpenAPI JSON", href: "/api/docs", description: "Machine-readable API spec" },
  { label: "Swagger UI", href: "/api/docs/ui", description: "Interactive API explorer" },
  { label: "Prometheus Metrics", href: "/api/metrics", description: "Monitoring endpoint" },
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
        background: "linear-gradient(160deg, #f8fbff 0%, #eef6ff 100%)",
        color: "#0b1220",
      }}
    >
      <section
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          background: "#ffffff",
          border: "1px solid #dbe7ff",
          borderRadius: "16px",
          padding: "1.5rem",
          boxShadow: "0 12px 30px rgba(20, 74, 170, 0.08)",
        }}
      >
        <p
          style={{
            display: "inline-block",
            margin: 0,
            marginBottom: "0.75rem",
            padding: "0.25rem 0.6rem",
            borderRadius: "999px",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
            background: "#e9f2ff",
            color: "#1b4fc2",
          }}
        >
          VIETERP ACCOUNTING
        </p>

        <h1 style={{ margin: 0, fontSize: "2rem", lineHeight: 1.2 }}>Finance Operations Hub</h1>
        <p style={{ marginTop: "0.75rem", marginBottom: 0, color: "#334155" }}>
          Module is running on port 3007. Use the links below to verify health, inspect API docs, and check
          metrics while developing.
        </p>

        <div
          style={{
            marginTop: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.9rem",
          }}
        >
          {quickLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                border: "1px solid #d6e4ff",
                borderRadius: "12px",
                padding: "0.9rem",
                background: "#f8fbff",
                color: "#0f172a",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>{item.label}</div>
              <div style={{ color: "#475569", fontSize: "0.92rem" }}>{item.description}</div>
              <div style={{ marginTop: "0.45rem", color: "#1d4ed8", fontSize: "0.85rem" }}>{item.href}</div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
