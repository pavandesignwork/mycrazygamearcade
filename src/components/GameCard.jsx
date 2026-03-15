import { Link } from "react-router-dom";

function GameCard({ game, forceBig }) {
  const isHighlighted = forceBig || game.highlighted;

  return (
    <Link
      to={`/game/${game.id}`}
      className={`game-card ${isHighlighted ? "game-card-big" : ""}`}
    >
      <div className="game-card-inner">
        <img src={game.thumbnail} alt={game.title} />
        <div className="game-card-overlay">
          <span>{game.title}</span>
        </div>
      </div>
    </Link>
  );
}

export default GameCard;
