import { Link } from "react-router-dom";

function GameCard({ game }) {
  const isHighlighted = game.highlighted;

  return (
    <Link
      to={`/game/${game.id}`}
      className={`game-card ${isHighlighted ? "game-card-big" : ""}`}
    >
      <img src={game.thumbnail} alt={game.title} />
      <p>{game.title}</p>
    </Link>
  );
}

export default GameCard;
