import GameCard from "./GameCard";

function GameGrid({ games }) {
  return (
    <div className="grid">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

export default GameGrid;
