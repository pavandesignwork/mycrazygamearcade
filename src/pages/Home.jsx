import { useEffect, useState } from "react";
import { getGames } from "../lib/supabase";
import GameGrid from "../components/GameGrid";

function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGames()
      .then(setGames)
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="main-content">
      {loading ? (
        <p className="loading-text">Loading games...</p>
      ) : games.length === 0 ? (
        <p className="loading-text">
          No games yet. Go to <a href="/admin" style={{ color: "#fff" }}>/admin</a> to add games.
        </p>
      ) : (
        <GameGrid games={games} />
      )}
    </div>
  );
}

export default Home;
