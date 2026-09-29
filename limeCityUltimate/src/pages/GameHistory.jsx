import { Link } from 'react-router-dom'
import { gamesPlayed, pointsPlayed } from '../data/gameHistory.js'
import LeaderboardTable from '../components/LeaderboardTable.jsx'

export default function GameHistory() {
  return (
    <div className="page wrap">
      <Link to="/records" className="btn btn-ghost" style={{ marginBottom: 32 }}>← Records</Link>

      <div className="page-head">
        <div>
          <span className="page-kicker">Season totals</span>
          <h1>Game history</h1>
        </div>
      </div>

      <LeaderboardTable title="Games played" rows={gamesPlayed} valueLabel="Games" />
      <LeaderboardTable title="Points played" rows={pointsPlayed} valueLabel="Points" />
    </div>
  )
}
