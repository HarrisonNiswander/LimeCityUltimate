import { useState } from 'react'
import { Link } from 'react-router-dom'
import games from '../data/games.js'
import tournaments from '../data/tournaments.js'
import './styles/Stats.css'

export default function Stats() {
  const [activeTournament, setActiveTournament] = useState(null)

  const sorted = [...games].sort((a, b) => new Date(b.date) - new Date(a.date))
  const visible = activeTournament
    ? sorted.filter((g) => g.tournament === activeTournament)
    : sorted

  return (
    <div className="page wrap">
      <div className="page-head">
        <div>
          <span className="page-kicker">Box scores</span>
          <h1>Stats</h1>
          <p className="page-sub" style={{ marginTop: 12 }}>
            Choose a tournament to narrow the list, or pick a game to see the full stat line.
          </p>
        </div>
      </div>

      <div className="tournament-filter">
        <button
          className={`tournament-pill ${activeTournament === null ? 'is-active' : ''}`}
          onClick={() => setActiveTournament(null)}
        >
          All games
        </button>
        {tournaments.map((t) => (
          <button
            key={t.id}
            className={`tournament-pill ${activeTournament === t.name ? 'is-active' : ''}`}
            onClick={() => setActiveTournament(t.name)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="game-list">
        {visible.map((g) => (
          <Link to={`/stats/${g.id}`} key={g.id} className="game-row">
            <span className={`game-result game-result-${g.result === 'W' ? 'win' : 'loss'}`}>
              {g.result}
            </span>
            <span className="game-row-main">
              <strong>vs. {g.opponent}</strong>
              <span className="game-row-sub">{g.tournament}</span>
            </span>
            <span className="game-row-score">{g.score}</span>
            <span className="game-row-date">
              {new Date(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span aria-hidden="true" className="game-row-arrow">→</span>
          </Link>
        ))}
        {visible.length === 0 && (
          <div className="game-list-empty">No games recorded for this tournament yet.</div>
        )}
      </div>
    </div>
  )
}
