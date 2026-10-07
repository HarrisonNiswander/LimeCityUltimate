import { useParams, Link, Navigate } from 'react-router-dom'
import games from '../data/games.js'
import { getGameBoxScore } from '../utils/gameBoxScore.js'
import './styles/Stats.css'

export default function StatsGame() {
  const { gameId } = useParams()
  const game = games.find((g) => g.id === gameId)

  if (!game) return <Navigate to="/stats" replace />

  const boxScore = getGameBoxScore(game).slice().sort((a, b) => {
    if (a.team !== b.team) return (a.team || '').localeCompare(b.team || '')
    return ((b.goals || 0) + (b.assists || 0)) - ((a.goals || 0) + (a.assists || 0))
  })

  return (
    <div className="page wrap">
      <Link to="/stats" className="btn btn-ghost" style={{ marginBottom: 32 }}>← All games</Link>

      <div className="page-head">
        <div>
          <span className="page-kicker">{game.tournament} · {new Date(game.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          {/* <h1>vs. {game.opponent}</h1> */}
          <h1>{game.opponent}</h1>
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

      {boxScore.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--cream)', margin: '40px 0 16px' }}>Full box score</h2>
          <div className="leader-table">
            <div className="leader-row leader-head" style={{ gridTemplateColumns: '1fr 110px repeat(4, 80px)' }}>
              <span>Player</span>
              <span>Team</span>
              <span>Goals</span>
              <span>Assists</span>
              <span>Blocks</span>
              <span>+/-</span>
            </div>
            {boxScore.map((p) => (
              <div className="leader-row" key={`${p.player}-${p.team}`} style={{ gridTemplateColumns: '1fr 110px repeat(4, 80px)' }}>
                <span>{p.player}</span>
                <span style={{ color: 'var(--muted)', fontFamily: 'inherit', fontWeight: 500 }}>{p.team || '—'}</span>
                <span>{p.goals ?? '—'}</span>
                <span>{p.assists ?? '—'}</span>
                <span>{p.blocks ?? '—'}</span>
                <span>{p.plusMinus !== undefined ? (p.plusMinus > 0 ? `+${p.plusMinus}` : p.plusMinus) : '—'}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
