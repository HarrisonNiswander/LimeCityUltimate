import { Link } from 'react-router-dom'
import { seasonRecords } from '../data/records.js'
import statCategories from '../data/statCategories.js'
import { singleGame, allTime } from '../data/statLeaders.js'
import StatLeadersOverview from '../components/StatLeadersOverview.jsx'
import './styles/Records.css'

export default function Records() {
  const offensive = statCategories.filter((s) => s.group === 'offensive')
  const defensive = statCategories.filter((s) => s.group === 'defensive')

  return (
    <div className="page wrap">
      <div className="page-head">
        <div>
          <span className="page-kicker">Season by season</span>
          <h1>Records</h1>
        </div>
        <Link to="/stats/history" className="btn btn-ghost">Game history</Link>
      </div>

      <h2 className="records-sub-head">Season history</h2>
      <div className="leader-table" style={{ marginBottom: 56 }}>
        <div className="leader-row leader-head" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <span>Season</span>
          <span>Record</span>
          <span>Finish</span>
        </div>
        {seasonRecords.map((s) => (
          <div className="leader-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }} key={s.season}>
            <span style={{ color: 'var(--cream)', fontWeight: 600 }}>{s.season}</span>
            <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{s.record}</span>
            <span style={{ color: 'var(--muted)' }}>{s.finish}</span>
          </div>
        ))}
      </div>

      <p className="page-sub" style={{ marginBottom: 32 }}>
        Pick a stat to see the top 10 single-game performances and the all-time leaders.
      </p>

      <h2 className="records-sub-head">Offensive statistics</h2>
      <div className="stat-directory">
        {offensive.map((s) => (
          <Link to={`/records/${s.id}`} key={s.id} className="stat-directory-item">
            <span>{s.label}</span>
            {s.note && <span className="stat-directory-note">{s.note}</span>}
            <span aria-hidden="true" className="stat-directory-arrow">→</span>
          </Link>
        ))}
      </div>

      <h2 className="records-sub-head" style={{ marginTop: 40 }}>Defensive statistics</h2>
      <div className="stat-directory">
        {defensive.map((s) => (
          <Link to={`/records/${s.id}`} key={s.id} className="stat-directory-item">
            <span>{s.label}</span>
            {s.note && <span className="stat-directory-note">{s.note}</span>}
            <span aria-hidden="true" className="stat-directory-arrow">→</span>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 56 }}>
        <StatLeadersOverview title="Single-game record holders" source={singleGame} withGame />
        <StatLeadersOverview title="All-time leaders" source={allTime} />
      </div>
    </div>
  )
}
