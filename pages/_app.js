import '../styles/globals.css'
import '../styles/leaderboard.css'; 
import '../styles/race-table.css'; 
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Cargar Google Analytics cada vez que se cambia de ruta
    const handleRouteChange = (url) => {
      window.gtag('config', 'G-TBS0QTFKV1', {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
    {/* Google Tag Manager Script */}
    <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=G-ZDXYJ2TNWF`}
      ></Script>
      <Script id="gtag-init">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ZDXYJ2TNWF');
        `}
      </Script>
    
    <div className="app-container">
      {/* Renderizamos la página */}
      <div className="content">
        <Component {...pageProps} />
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          Con amor ❤️ al kartismo - Redondo 
        </p>
      </footer>
    </div>
    </>
  );
}

export default MyApp
