import statCategories from '../data/statCategories.js'
import { findPlayer } from '../utils/findPlayer.js'
import { withRanks } from '../utils/leaderboard.js'
import '../components/styles/LeaderboardTable.css'
import './styles/StatLeadersOverview.css'

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function GroupRows({ label, cats, source, withGame }) {
  return (
    <>
      <div className="slo-group-label">{label}</div>
      {cats.map((s) => {
        const rows = source[s.id] || []
        if (!rows.length) return null
        const leaders = withRanks(rows).filter((r) => r.rank === 1)

        return leaders.map((r, i) => {
          const player = findPlayer(r.player)
          return (
            <div
              key={`${s.id}-${i}`}
              className={`lb-row medal-gold ${withGame ? 'slo-row-game' : 'slo-row-plain'}`}
            >
              <span className="slo-stat-label">{i === 0 ? s.label : ''}</span>
              <span className="lb-player">
                {i === 0 && (
                  <img
                    className="lb-photo"
                    src={player ? player.photo : '/players/placeholder.svg'}
                    alt=""
                  />
                )}
                <span className="lb-player-name">{r.player}</span>
              </span>
              <span className="lb-value">{r.value}{s.suffix || ''}</span>
              {withGame && <span className="lb-game">vs. {r.opponent} · {formatDate(r.date)}</span>}
            </div>
          )
        })
      })}
    </>
  )
}

export default function StatLeadersOverview({ title, source, withGame = false }) {
  const offensive = statCategories.filter((s) => s.group === 'offensive')
  const defensive = statCategories.filter((s) => s.group === 'defensive')

  return (
    <div className="lb-table">
      <h3 className="lb-title">{title}</h3>
      <div className={`lb-row lb-head ${withGame ? 'slo-row-game' : 'slo-row-plain'}`}>
        <span>Stat</span>
        <span>Player</span>
        <span>Value</span>
        {withGame && <span>Game</span>}
      </div>
      <GroupRows label="Offensive Statistics" cats={offensive} source={source} withGame={withGame} />
      <GroupRows label="Defensive Statistics" cats={defensive} source={source} withGame={withGame} />
    </div>
  )
}
