import { useState } from 'react'
import players from '../data/players.js'
import PlayerCard from '../components/PlayerCard.jsx'
import PlayerModal from '../components/PlayerModal.jsx'
import './styles/Roster.css'

export default function Roster() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="page wrap">
      <div className="page-head">
        <div>
          <span className="page-kicker">{players.length} players</span>
          <h1>Roster</h1>
          <p className="page-sub" style={{ marginTop: 12 }}>
            Tap any player for season stats and bio.
          </p>
        </div>
      </div>

      <div className="roster-grid">
        {players.map((p) => (
          <PlayerCard key={p.id} player={p} onSelect={setSelected} />
        ))}
      </div>

      {selected && <PlayerModal player={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
