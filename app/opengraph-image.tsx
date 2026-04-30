import { ImageResponse } from "next/og";

/**
 * Default Open Graph card for any route that doesn't define its own
 * `opengraph-image.tsx`. Keeps the brand consistent across share previews.
 */

export const runtime = "edge";
export const alt = "Vixi AI — Personalised AI-generated courses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #fdf6f0 0%, #ffffff 50%, #f3eef9 100%)",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "rgb(255, 164, 44)",
            fontSize: "44px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "9999px",
              background: "rgb(255, 164, 44)",
              color: "white",
              fontSize: "40px",
            }}
          >
            V
          </span>
          Vixi AI
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "28px",
              fontWeight: 600,
              color: "rgb(255, 164, 44)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            #1 AI to publish gamified courses
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "76px",
              fontWeight: 700,
              color: "rgb(74, 50, 111)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Create your Duolingo-like courses, in minutes.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "30px",
              color: "rgb(111, 119, 130)",
              lineHeight: 1.4,
              marginTop: "24px",
              maxWidth: "920px",
            }}
          >
            Upload your PDFs, LinkedIn posts, podcasts, or lectures. Vixi&apos;s AI converts them into interactive Duolingo-like courses.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgb(111, 119, 130)",
            fontSize: "26px",
          }}
        >
          <span>vixiai.co</span>
          <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                display: "flex",
                width: "12px",
                height: "12px",
                borderRadius: "9999px",
                background: "rgb(74, 50, 111)",
              }}
            />
            <span
              style={{
                display: "flex",
                width: "12px",
                height: "12px",
                borderRadius: "9999px",
                background: "rgb(255, 164, 44)",
              }}
            />
            <span
              style={{
                display: "flex",
                width: "12px",
                height: "12px",
                borderRadius: "9999px",
                background: "rgb(255, 99, 132)",
              }}
            />
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
