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
          Con amor ❤️ al kartismo - Cesar Redondo - <a href="mailto:credondocr@gmail.com">credondocr@gmail.com</a>
        </p>
      </footer>
    </div>
  );
}

export default MyApp
