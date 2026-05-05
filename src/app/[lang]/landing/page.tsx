import AutoplayVideo from "./AutoplayVideo";

export const metadata = {
  title: "Ancestro · Brasil",
  description:
    "Sua energia. Seu controle. Seu futuro. Junte-se à comunidade solar do Brasil.",
};

export default function LandingPage() {
  const videoSrc = "https://assets.ancestro.ai/ancestr-%20brasil(1)%20(1).mp4";
  const joinHref = "https://ancestro.ai/pt/join";
  const instagramHref = "https://www.instagram.com/ancestro.ai";

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;700;800&display=swap"
      />
      <style>{`
        @media (max-width: 767px) {
          .landing-main {
            height: auto !important;
            min-height: 100svh !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .landing-video-wrap {
            position: relative !important;
            width: 100% !important;
            aspect-ratio: 16 / 9;
            flex-shrink: 0;
          }
          .landing-video {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            transform: none !important;
            min-width: 0 !important;
            min-height: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            object-position: center !important;
          }
          .landing-overlay-top { display: none !important; }
          .landing-overlay-mid { display: none !important; }
          .landing-overlay-bottom { display: none !important; }
          .landing-nav {
            position: relative !important;
            background: rgba(10,10,10,0.9) !important;
            order: 1;
          }
          .landing-video-wrap { order: 2; }
          .landing-hero {
            position: relative !important;
            inset: auto !important;
            top: auto !important;
            bottom: auto !important;
            left: auto !important;
            right: auto !important;
            max-width: 100% !important;
            padding: 24px 20px 32px !important;
            gap: 14px !important;
            flex: 1;
            justify-content: flex-end;
            order: 3;
          }
        }
      `}</style>
      <main
        className="landing-main"
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0A0A0A 0%, #1A1208 50%, #0A0A0A 100%)",
          fontFamily: "Urbanist, system-ui, sans-serif",
          color: "#FFFFFF",
        }}
      >
        {/* K61Pes — Video full bleed (autoplay, mobile-friendly) */}
        <div className="landing-video-wrap">
          <AutoplayVideo src={videoSrc} />
        </div>

        {/* On1OW — Top overlay: #0A0A0Add → transparent (180°) */}
        <div
          className="landing-overlay-top"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "25vh",
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.87) 0%, rgba(10,10,10,0) 100%)",
            zIndex: 1,
          }}
        />
        {/* tZcPk — Mid overlay: solid #0A0A0A55 */}
        <div
          className="landing-overlay-mid"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,10,10,0.33)",
            zIndex: 1,
          }}
        />
        {/* sN5yz — Bottom overlay: transparent → #0A0A0Aaa@35% → #0A0A0Aff (180°) */}
        <div
          className="landing-overlay-bottom"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "70vh",
            background:
              "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.67) 35%, rgba(10,10,10,1) 100%)",
            zIndex: 1,
          }}
        />

        {/* Top nav (menu kept): logo + amber CTA */}
        <nav
          className="landing-nav"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 72,
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#F59E0B",
                display: "inline-block",
                boxShadow: "0 0 16px rgba(245,158,11,0.6)",
              }}
            />
            <span
              style={{
                fontFamily: "Urbanist, sans-serif",
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: 3,
                color: "#FFFFFF",
              }}
            >
              ANCESTRO
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @ancestro.ai"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                borderRadius: 9999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#FFFFFF",
                textDecoration: "none",
                backdropFilter: "blur(6px)",
              }}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          <a
            href={joinHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 18px",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "Urbanist, sans-serif",
              textDecoration: "none",
              backdropFilter: "blur(6px)",
            }}
          >
            Junte-se
          </a>
          </div>
        </nav>

        {/* IjTLY — Hero content: layout vertical gap 12, width 737, anchored bottom-left */}
        <section
          className="landing-hero"
          style={{
            position: "absolute",
            left: "max(20px, 4vw)",
            right: "max(20px, 4vw)",
            bottom: "max(24px, 5vh)",
            maxWidth: 737,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            zIndex: 3,
          }}
        >
          {/* IckG5 — Title: Urbanist 42 weight 800 ls=-1.4 lh=1.05 */}
          <h1
            style={{
              fontFamily: "Urbanist, sans-serif",
              fontSize: "clamp(30px, 7vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.4,
              margin: 0,
              color: "#FFFFFF",
              whiteSpace: "pre-line",
            }}
          >
            {"Sua energia. Seu controle.\nSeu futuro."}
          </h1>

          {/* c24rQ — Subtext: Urbanist 13 lh=1.55 width 580 #D4D4D8 */}
          <p
            style={{
              fontFamily: "Urbanist, sans-serif",
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.55,
              maxWidth: 580,
              margin: 0,
              color: "#D4D4D8",
            }}
          >
            Conectamos tecnologia, eficiência e inovação para que você viva uma
            energia limpa — simples, acessível e inteligente.
          </p>

          {/* rqlGC — Pillars row: 3 pills (Liberdade / Segurança / Poder) */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 4,
            }}
          >
            <Pillar
              icon={
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 20h10" />
                  <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                  <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
                  <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
                </svg>
              }
              color="#10B981"
              label="Liberdade"
              sub="para crescer"
            />
            <Pillar
              icon={
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              }
              color="#FBBF24"
              label="Segurança"
              sub="para planejar"
            />
            <Pillar
              icon={
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                </svg>
              }
              color="#A78BFA"
              label="Poder"
              sub="para ir mais longe"
            />
          </div>

          {/* gnke7 hcRow → k6iEg hcCtaP — CTA amber gradient #FBBF24 → #F59E0B at 135° */}
          <div style={{ marginTop: 8 }}>
            <a
              href={joinHref}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                height: 52,
                padding: "0 28px",
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
                color: "#0A0A0A",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "Urbanist, sans-serif",
                textDecoration: "none",
                boxShadow: "0 10px 40px rgba(251,191,36,0.5)",
              }}
            >
              Comece a economizar
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0A0A0A"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

function Pillar({
  icon,
  color,
  label,
  sub,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  sub: string;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 36,
        padding: "0 14px",
        borderRadius: 10,
        background: `${color}15`,
        border: `1px solid ${color}40`,
      }}
    >
      {icon}
      <span
        style={{
          fontFamily: "Urbanist, sans-serif",
          fontSize: 12,
          fontWeight: 800,
          color: "#FFFFFF",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "Urbanist, sans-serif",
          fontSize: 11,
          fontWeight: 500,
          color: "#A1A1AA",
        }}
      >
        {sub}
      </span>
    </div>
  );
}
