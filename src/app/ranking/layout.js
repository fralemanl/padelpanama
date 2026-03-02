import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Ranking Nacional de Panamá",
  description: "Ranking oficial de jugadores de pádel en Panamá",
};

export default function RootLayout({children}) {
  return (
    <div className="tennisclub_body body_style_wide body_filled article_style_stretch">
      <div className="body_wrap">
        <div className="page_wrap">
          <div
            className="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original"
            style={{
              backgroundImage: "url('/fondo elo.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(6, 78, 94, 0.75), rgba(8, 145, 178, 0.65))",
              }}
            />
            <div className="top_panel_title_inner top_panel_inner_style_3 title_present_inner breadcrumbs_present_inner">
              <div
                className="content_wrap"
                style={{
                  position: "relative",
                  textAlign: "center",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                }}
              >
                <nav
                  aria-label="Volver al home"
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "1rem",
                    display: "flex",
                    fontSize: "0.9rem",
                  }}
                >
                  <a href="/index" style={{color: "#ffffff", fontWeight: 600}}>
                    Volver al home
                  </a>
                </nav>
                <h1
                  className="page_title"
                  style={{
                    color: "#ffffff",
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    letterSpacing: "-0.02em",
                    marginBottom: "0.4rem",
                  }}
                >
                  Ranking Nacional de Panamá
                </h1>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.85)",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Panamá PA
                </p>
              </div>
            </div>
          </div>

          <main className="page_content_wrap" style={{flex: 1}}>
            <div className="content_wrap">{children}</div>
          </main>

          <Script
            id="tennisclub-storage"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html:
                "window.TENNISCLUB_STORAGE = window.TENNISCLUB_STORAGE || {};",
            }}
          />
          <Script src="/js/jquery/jquery.js" strategy="beforeInteractive" />
          <Script src="/js/superfish.js" strategy="beforeInteractive" />
          <Script src="/js/_packed.js" strategy="afterInteractive" />
          <Script src="/js/global.min.js" strategy="afterInteractive" />
          <Script src="/js/jquery.slidemenu.js" strategy="afterInteractive" />
          <Script
            src="/js/vendor/woocommerce/woocommerce.min.js"
            strategy="afterInteractive"
          />
          <Script
            src="/js/vendor/woocommerce/cart-fragments.min.js"
            strategy="afterInteractive"
          />
          <Script src="/js/core.utils.min.js" strategy="afterInteractive" />
          {/* <Script src="/js/core.init.min.js" strategy="afterInteractive" /> */}
          <Script src="/js/theme.init.min.js" strategy="afterInteractive" />
          <Script src="/js/shortcodes.min.js" strategy="afterInteractive" />
          <Script
            src="/js/core.messages/core.messages.min.js"
            strategy="afterInteractive"
          />

          {/* Footer removed as requested */}
          {/* All content ends here, close all divs properly */}
        </div>
      </div>
    </div>
  );
  // ...existing code...
}
