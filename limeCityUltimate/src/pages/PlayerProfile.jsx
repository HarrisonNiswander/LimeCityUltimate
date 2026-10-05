import { useParams, Link, Navigate } from 'react-router-dom'
import players from '../data/players.js'
import statCategories from '../data/statCategories.js'
import PlayerStatTable from '../components/PlayerStatTable.jsx'
import {
  getSingleGameBest,
  getSingleGameRank,
  getAllTimeValue,
  getAllTimeRank,
} from '../utils/playerRecords.js'
import './styles/PlayerProfile.css'

export default function PlayerProfile() {
  const { playerId } = useParams()
  const player = players.find((p) => p.id === playerId)

  if (!player) return <Navigate to="/roster" replace />

  const singleGameRows = []
  const allTimeRows = []

  statCategories.forEach((s) => {
    const best = getSingleGameBest(player.name, s.id)
    if (best) {
      singleGameRows.push({
        id: s.id,
        label: s.label,
        group: s.group,
        value: best.value,
        suffix: s.suffix,
        game: best,
        rank: getSingleGameRank(player.name, s.id, best.value),
      })
    }

    const atValue = getAllTimeValue(player.name, s.id)
    allTimeRows.push({
      id: s.id,
      label: s.label,
      group: s.group,
      value: atValue,
      suffix: s.suffix,
      rank: getAllTimeRank(player.name, s.id, atValue),
    })
  })

  return (
    <div className="page wrap">
      <Link to="/roster" className="btn btn-ghost" style={{ marginBottom: 32 }}>← Roster</Link>

      <div className="profile-top">
        <img src={player.photo} alt="" className="profile-photo" />
        <div>
          <span className="page-kicker">#{player.number} · {player.position}</span>
          <h1 className="profile-name">
            {player.name}
            {player.nickname && <span className="profile-nickname"> "{player.nickname}"</span>}
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: 10, maxWidth: '55ch', lineHeight: 1.6 }}>
            {player.bio}
          </p>
        </div>
      </div>

      <div className="profile-facts">
        <div className="profile-fact">
          <span className="page-kicker">Hometown</span>
          <strong>{player.hometown}</strong>
        </div>
        <div className="profile-fact">
          <span className="page-kicker">Years with team</span>
          <strong>{player.yearsWithTeam}</strong>
        </div>
        <div className="profile-fact">
          <span className="page-kicker">Frisbee clashes</span>
          <strong>{player.stats.gamesPlayed}</strong>
        </div>
        <div className="profile-fact">
          <span className="page-kicker">Frisbee clash record</span>
          <strong>{player.clashRecord}</strong>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <PlayerStatTable title="Single-game bests" rows={singleGameRows} withGame />
        <PlayerStatTable title="All-time stats" rows={allTimeRows} />
      </div>
    </div>
  )
}
