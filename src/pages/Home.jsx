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
    <div>
      <h1>Play Games</h1>
      {loading ? (
        <p style={{ textAlign: "center", padding: 40, color: "#999" }}>Loading...</p>
      ) : games.length === 0 ? (
        <p style={{ textAlign: "center", padding: 40, color: "#999" }}>
          No games yet. Go to <a href="/admin">/admin</a> to add games.
        </p>
      ) : (
        <GameGrid games={games} />
      )}
    </div>
  );
}

export default Home;
