import { useParams, Link, Navigate } from 'react-router-dom'
import statCategories from '../data/statCategories.js'
import { singleGame, allTime } from '../data/statLeaders.js'
import LeaderboardTable from '../components/LeaderboardTable.jsx'

export default function RecordStat() {
  const { statId } = useParams()
  const stat = statCategories.find((s) => s.id === statId)

  if (!stat) return <Navigate to="/records" replace />

  const suffix = stat.suffix || ''

  return (
    <div className="page wrap">
      <Link to="/records" className="btn btn-ghost" style={{ marginBottom: 32 }}>← All records</Link>

      <div className="page-head">
        <div>
          <span className="page-kicker">{stat.group === 'offensive' ? 'Offensive' : 'Defensive'} statistic{stat.note ? ` · ${stat.note}` : ''}</span>
          <h1>{stat.label}</h1>
        </div>
      </div>

      <LeaderboardTable
        title="Single-game top 10"
        rows={singleGame[stat.id] || []}
        valueLabel={stat.label}
        suffix={suffix}
        withGame
      />

      <LeaderboardTable
        title="All-time leaders"
        rows={allTime[stat.id] || []}
        valueLabel={stat.label}
        suffix={suffix}
      />
    </div>
  )
}
