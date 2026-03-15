import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGameById, getGames } from "../lib/supabase";
import GameGrid from "../components/GameGrid";

function GamePage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getGameById(id), getGames()])
      .then(([g, all]) => {
        setGame(g);
        setSimilar(
          all.filter((x) => x.category === g.category && x.id !== id).slice(0, 4)
        );
      })
      .catch(() => setGame(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", padding: 40 }}>Loading...</p>;
  if (!game) return <h1>Game not found</h1>;

  return (
    <div>
      <h1>{game.title}</h1>

      <div className="player">
        <iframe
          src={game.embed_url}
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; gamepad"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          title={game.title}
          style={{ border: "none", background: "#000", display: "block" }}
        ></iframe>
      </div>

      {!game.embed_url && (
        <p style={{ textAlign: "center", color: "red", padding: 20 }}>
          No embed URL set for this game.
        </p>
      )}

      {similar.length > 0 && (
        <>
          <h2>Similar Games</h2>
          <GameGrid games={similar} />
        </>
      )}
    </div>
  );
}

export default GamePage;
