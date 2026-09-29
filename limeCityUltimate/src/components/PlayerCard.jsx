export default function PlayerCard({ player, onSelect }) {
  return (
    <button className="player-card" onClick={() => onSelect(player)}>
      <span className="player-photo-wrap">
        <img src={player.photo} alt="" className="player-photo" />
        <span className="player-number">{player.number}</span>
      </span>
      <span className="player-name">{player.name}</span>
      <span className="player-position">{player.position}</span>
    </button>
  )
}
