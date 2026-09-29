import { medalClass } from '../utils/leaderboard.js'
import '../components/LeaderboardTable.css'
import '../components/StatLeadersOverview.css'
import './styles/PlayerStatTable.css'

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function PlayerStatTable({ title, rows, withGame = false }) {
  let lastGroup = null

  return (
    <div className="lb-table">
      <h3 className="lb-title">{title}</h3>
      <div className={`lb-row lb-head ${withGame ? 'pst-row-game' : 'pst-row-plain'}`}>
        <span>Stat</span>
        <span>Value</span>
        {withGame && <span>Game</span>}
        <span />
      </div>

      {rows.map((r) => {
        const showGroupLabel = r.group !== lastGroup
        lastGroup = r.group
        const medal = medalClass(r.rank)

        return (
          <div key={r.id}>
            {showGroupLabel && (
              <div className="slo-group-label">
                {r.group === 'offensive' ? 'Offensive Statistics' : 'Defensive Statistics'}
              </div>
            )}
            <div className={`lb-row ${medal} ${withGame ? 'pst-row-game' : 'pst-row-plain'}`}>
              <span className="slo-stat-label">{r.label}</span>
              <span className="lb-value">{r.value === null ? '—' : `${r.value}${r.suffix || ''}`}</span>
              {withGame && (
                <span className="lb-game">
                  {r.game ? `vs. ${r.game.opponent} · ${formatDate(r.game.date)}` : '—'}
                </span>
              )}
              <span className="pst-record-badge">{r.rank === 1 ? '🥇 Team Record' : ''}{r.rank === 2 ? '🥈 #2 Overall' : ''}{r.rank === 3 ? '🥉 #3 Overall' : ''}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
