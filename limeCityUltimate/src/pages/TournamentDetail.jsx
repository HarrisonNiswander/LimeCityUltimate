import { useParams, Link, Navigate } from 'react-router-dom'
import tournaments from '../data/tournaments.js'
import games from '../data/games.js'
import { getTournamentPlayerTotals } from '../utils/tournamentStats.js'
import { findPlayer } from '../utils/findPlayer.js'
import './styles/TournamentResults.css'

export default function TournamentDetail() {
  const { tournamentId } = useParams()
  const tournament = tournaments.find((t) => t.id === tournamentId)

  if (!tournament) return <Navigate to="/tournaments" replace />

  const tournamentGames = games.filter((g) => g.tournament === tournament.name)
  const playerTotals = getTournamentPlayerTotals(tournament.name)

  return (
    <div className="page wrap">
      <Link to="/tournaments" className="btn btn-ghost" style={{ marginBottom: 32 }}>← All tournaments</Link>

      <div className="page-head">
        <div>
          <span className="page-kicker">{tournament.date} · {tournament.location}</span>
          <h1>{tournament.name}</h1>
        </div>
        <div className="tourney-tags">
          <span className="tourney-tag tourney-tag-accent">{tournament.finish}</span>
          <span className="tourney-tag">{tournament.record}</span>
        </div>
      </div>

      <p style={{ color: 'var(--cream)', lineHeight: 1.7, maxWidth: '65ch', marginBottom: 40 }}>
        {tournament.notes}
      </p>

      {tournamentGames.length > 0 && (
        <>
          <h2 className="records-sub-head">Games at this tournament</h2>
          <div className="game-list" style={{ marginBottom: 40 }}>
            {tournamentGames.map((g) => (
              <Link to={`/stats/${g.id}`} key={g.id} className="game-row">
                <span className={`game-result game-result-${g.result === 'W' ? 'win' : 'loss'}`}>
                  {g.result}
                </span>
                <span className="game-row-main">
                  <strong>vs. {g.opponent}</strong>
                  <span className="game-row-sub">Full box score</span>
                </span>
                <span className="game-row-score">{g.score}</span>
                <span className="game-row-date">
                  {new Date(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span aria-hidden="true" className="game-row-arrow">→</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 className="records-sub-head">Top performers</h2>
      <div className="stat-directory" style={{ gridTemplateColumns: '1fr', marginBottom: 40 }}>
        {tournament.topPerformers.map((p) => (
          <div className="stat-directory-item" key={p.name} style={{ cursor: 'default' }}>
            <span>{p.name}</span>
            <span className="stat-directory-note" style={{ marginLeft: 'auto' }}>{p.line}</span>
          </div>
        ))}
      </div>

      {playerTotals.length > 0 && (
        <>
          <h2 className="records-sub-head">Player totals</h2>
          <div className="leader-table">
            <div className="leader-row leader-head" style={{ gridTemplateColumns: '1fr 110px repeat(4, 80px)' }}>
              <span>Player</span>
              <span>Team</span>
              <span>Goals</span>
              <span>Assists</span>
              <span>Blocks</span>
              <span>+/-</span>
            </div>
            {playerTotals.map((p) => {
              const player = findPlayer(p.player)
              return (
                <Link
                  to={player ? `/roster/${player.id}` : '/roster'}
                  key={p.player}
                  className="leader-row"
                  style={{ gridTemplateColumns: '1fr 110px repeat(4, 80px)' }}
                >
                  <span style={{ color: 'var(--cream)', fontWeight: 600 }}>{p.player}</span>
                  <span style={{ color: 'var(--muted)', fontFamily: 'inherit', fontWeight: 500 }}>{p.team || '—'}</span>
                  <span>{p.goals}</span>
                  <span>{p.assists}</span>
                  <span>{p.blocks}</span>
                  <span>{p.plusMinus > 0 ? `+${p.plusMinus}` : p.plusMinus}</span>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
