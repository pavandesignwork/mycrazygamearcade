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

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!game) return <div className="game-page"><h1>Game not found</h1></div>;

  return (
    <div className="game-page">
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
