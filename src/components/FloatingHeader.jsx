import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getGames } from "../lib/supabase";

const CATEGORIES = [
  "2 Player Games",
  "Shooting Games",
  "Car Games",
  "Sports Games",
  "Puzzle Games",
  "Action Games",
  "Racing Games",
  "Arcade Games",
];

export default function FloatingHeader() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [games, setGames] = useState([]);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (panelOpen && games.length === 0) {
      getGames().then(setGames).catch(() => {});
    }
  }, [panelOpen, games.length]);

  // Listen for open-search-panel event from homepage
  useEffect(() => {
    const handler = () => setPanelOpen(true);
    document.addEventListener("open-search-panel", handler);
    return () => document.removeEventListener("open-search-panel", handler);
  }, []);

  const filtered = games.filter((g) => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || (g.category || "").toLowerCase().includes(activeCategory.toLowerCase().replace(" games", ""));
    return matchSearch && matchCat;
  });

  return (
    <>
      {/* Floating Logo Bar - only show on non-home pages */}
      {!isHome && (
        <div className="floating-header">
          <Link to="/" className="logo-bar" style={{ textDecoration: "none" }}>
            <div className="logo-text">
              <span className="my">My</span>
              <span className="crazy">Crazy</span>
              <br />
              <span className="arcade">Arcade</span>
              <span className="dot-com">.Com</span>
            </div>
          </Link>
          <div className="header-icons">
            <button className="icon-btn" title="Profile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="icon-btn" onClick={() => setPanelOpen(true)} title="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div
        className={`panel-overlay ${panelOpen ? "open" : ""}`}
        onClick={() => setPanelOpen(false)}
      />

      {/* Side Panel */}
      <div className={`side-panel ${panelOpen ? "open" : ""}`}>
        <div className="panel-header">
          <div className="panel-logo">M</div>
          <input
            className="panel-search"
            type="text"
            placeholder="What are you playing today?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="panel-close" onClick={() => setPanelOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="panel-section-title">
          {search ? "Search Results" : "Popular this week"}
        </div>
        <div className="panel-grid">
          {filtered.map((game) => (
            <Link
              key={game.id}
              to={`/game/${game.id}`}
              className="panel-game-card"
              onClick={() => setPanelOpen(false)}
            >
              <img src={game.thumbnail} alt={game.title} />
            </Link>
          ))}
          {filtered.length === 0 && (
            <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#999", padding: 20 }}>
              No games found
            </p>
          )}
        </div>
      </div>
    </>
  );
}
