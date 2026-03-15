import { useEffect, useState } from "react";
import { getGames } from "../lib/supabase";
import { Link } from "react-router-dom";
import GameCard from "../components/GameCard";

function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGames()
      .then(setGames)
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, []);

  // First highlighted game goes big on right, rest are normal
  const highlightedIndex = games.findIndex((g) => g.highlighted);
  const bigGame = highlightedIndex !== -1 ? games[highlightedIndex] : games[0];
  const otherGames = games.filter((g) => g !== bigGame);

  return (
    <div className="main-content">
      {loading ? (
        <p className="loading-text">Loading games...</p>
      ) : games.length === 0 ? (
        <p className="loading-text">
          No games yet. Go to <a href="/admin" style={{ color: "#fff" }}>/admin</a> to add games.
        </p>
      ) : (
        <div className="hero-grid">
          {/* Logo block - top left */}
          <div className="hero-logo-block">
            <div className="hero-logo-top">
              <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/logo.png" alt="MyCrazyArcade" className="hero-logo-img" />
              </Link>
            </div>
            <div className="hero-logo-bottom">
              <button className="hero-icon-btn" onClick={() => document.dispatchEvent(new CustomEvent("open-search-panel"))} title="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <div className="hero-icon-divider" />
              <button className="hero-icon-btn" title="Profile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Big featured game - top right */}
          {bigGame && (
            <Link to={`/game/${bigGame.id}`} className="hero-big-game">
              <img src={bigGame.thumbnail} alt={bigGame.title} />
              <div className="hero-big-overlay">
                <span>{bigGame.title}</span>
              </div>
            </Link>
          )}

          {/* Small games fill the rest */}
          {otherGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
