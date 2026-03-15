import { Link } from "react-router-dom";

function GameCard({ game }) {
  return (
    <Link to={`/game/${game.id}`} className="game-card">
      <img src={game.thumbnail} alt={game.title} />
      <p>{game.title}</p>
    </Link>
  );
}

export default GameCard;
