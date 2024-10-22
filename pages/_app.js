import '../styles/globals.css'
import '../styles/leaderboard.css'; 
import '../styles/race-table.css'; 
function MyApp({ Component, pageProps }) {
  return (
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
  );
}

export default MyApp
