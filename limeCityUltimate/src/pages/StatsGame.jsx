import { useParams, Link, Navigate } from 'react-router-dom'
import games from '../data/games.js'
import './styles/Stats.css'

export default function StatsGame() {
  const { gameId } = useParams()
  const game = games.find((g) => g.id === gameId)

  if (!game) return <Navigate to="/stats" replace />

  return (
    <div className="page wrap">
      <Link to="/stats" className="btn btn-ghost" style={{ marginBottom: 32 }}>← All games</Link>

      <div className="page-head">
        <div>
          <span className="page-kicker">{game.tournament} · {new Date(game.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <h1>vs. {game.opponent}</h1>
        </div>
        <div className={`game-score-badge game-score-badge-${game.result === 'W' ? 'win' : 'loss'}`}>
          {game.result} {game.score}
        </div>
      </div>

      <h2 style={{ fontSize: '1.3rem', color: 'var(--cream)', marginBottom: 16 }}>Stat leaders</h2>
      <div className="leader-table">
        <div className="leader-row leader-head">
          <span>Player</span>
          <span>Goals</span>
          <span>Assists</span>
          <span>Blocks</span>
        </div>
        {game.leaders.map((p) => (
          <div className="leader-row" key={p.name}>
            <span>{p.name}</span>
            <span>{p.goals}</span>
            <span>{p.assists}</span>
            <span>{p.blocks}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
