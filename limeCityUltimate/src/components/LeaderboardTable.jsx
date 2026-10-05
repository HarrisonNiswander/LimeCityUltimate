import { withRanks, medalClass } from '../utils/leaderboard.js'
import { findPlayer } from '../utils/findPlayer.js'
import './styles/LeaderboardTable.css'

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function LeaderboardTable({ title, rows, valueLabel, suffix = '', withGame = false }) {
  const ranked = withRanks(rows)

  return (
    <div className="lb-table">
      {title && <h3 className="lb-title">{title}</h3>}
      <div className={`lb-row lb-head ${withGame ? 'lb-row-game' : 'lb-row-plain'}`}>
        <span>Rank</span>
        <span>Player</span>
        <span>{valueLabel}</span>
        {withGame && <span>Game</span>}
      </div>

      {ranked.length === 0 && (
        <div className="lb-row lb-empty">
          <span>N/A — no qualifying record yet</span>
        </div>
      )}

      {ranked.map((r, i) => {
        const medal = medalClass(r.rank)
        const player = findPlayer(r.player)

        if (r.tie) {
          return (
            <div key={i} className={`lb-row lb-tie ${medal} ${withGame ? 'lb-row-game' : 'lb-row-plain'}`}>
              <span />
              <span className="lb-player-name lb-tie-name">{r.player}</span>
              <span />
              {withGame && <span className="lb-game">vs. {r.opponent} · {formatDate(r.date)}</span>}
            </div>
          )
        }

        return (
          <div key={i} className={`lb-row ${medal} ${withGame ? 'lb-row-game' : 'lb-row-plain'}`}>
            <span className="lb-rank">{r.rank}</span>
            <span className="lb-player">
              {r.rank <= 3 && (
                <img
                  className="lb-photo"
                  src={player ? player.photo : '/players/placeholder.svg'}
                  alt=""
                />
              )}
              <span className="lb-player-name">{r.player}</span>
            </span>
            <span className="lb-value">{r.value}{suffix}</span>
            {withGame && <span className="lb-game">vs. {r.opponent} · {formatDate(r.date)}</span>}
          </div>
        )
      })}
    </div>
  )
}
