export const metadata = {
  title: "Ancestro · Brasil",
  description:
    "Sua energia. Seu controle. Seu futuro. Junte-se à comunidade solar do Brasil.",
};

export default function LandingPage() {
  const videoSrc = "https://assets.ancestro.ai/ancestr-%20brasil(1)%20(1).mp4";
  const joinHref = "https://ancestro.ai/es/join";

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;700;800&display=swap"
      />
      <main
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
        {/* K61Pes — Video full bleed (autoplay) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "100%",
            minHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "cover",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* On1OW — Top overlay: #0A0A0Add → transparent (180°) */}
        <div
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
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,10,10,0.33)",
            zIndex: 1,
          }}
        />
        {/* sN5yz — Bottom overlay: transparent → #0A0A0Aaa@35% → #0A0A0Aff (180°) */}
        <div
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
        </nav>

        {/* RR2Rt — Play button decorativo (rings + filled center) */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 120,
            height: 120,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {/* Outer ring 120×120 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1.5px solid rgba(255,255,255,0.25)",
            }}
          />
          {/* Mid ring 90×90 */}
          <div
            style={{
              position: "absolute",
              top: 15,
              left: 15,
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.13)",
              border: "1.5px solid rgba(255,255,255,0.38)",
            }}
          />
          {/* Filled inner button 60×60 */}
          <div
            style={{
              position: "absolute",
              top: 30,
              left: 30,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#FFFFFF",
              boxShadow: "0 0 40px rgba(255,255,255,0.38)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={24} height={24} viewBox="0 0 24 24" fill="#0A0A0A">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* IjTLY — Hero content: layout vertical gap 12, width 737, anchored bottom-left */}
        <section
          style={{
            position: "absolute",
            left: "max(32px, 4vw)",
            right: "max(32px, 4vw)",
            bottom: "max(48px, 6vh)",
            maxWidth: 737,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            zIndex: 3,
          }}
        >
          {/* IckG5 — Title: Urbanist 42 weight 800 ls=-1.4 lh=1.05 */}
          <h1
            style={{
              fontFamily: "Urbanist, sans-serif",
              fontSize: "clamp(36px, 5vw, 56px)",
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
