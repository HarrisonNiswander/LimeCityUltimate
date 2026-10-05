import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function PlayerModal({ player, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!player) return null

  const { name, nickname, number, position, photo, year, hometown, bio, stats } = player

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} ref={closeRef} aria-label="Close">✕</button>

        <div className="modal-top">
          <img src={photo} alt="" className="modal-photo" />
          <div>
            <span className="page-kicker">#{number} · {position}</span>
            <h2 id="player-modal-title" className="modal-name">
              {name}
              {nickname && <span className="modal-nickname"> "{nickname}"</span>}
            </h2>
            <p style={{ color: 'var(--muted)', marginTop: 6 }}>{year} · {hometown}</p>
          </div>
        </div>

        <p style={{ marginTop: 24, color: 'var(--cream)', lineHeight: 1.6 }}>{bio}</p>

        <div className="modal-stats">
          <div className="modal-stat"><strong>{stats.goals}</strong><span>Goals</span></div>
          <div className="modal-stat"><strong>{stats.assists}</strong><span>Assists</span></div>
          <div className="modal-stat"><strong>{stats.blocks}</strong><span>Blocks</span></div>
          <div className="modal-stat"><strong>{stats.gamesPlayed}</strong><span>Games</span></div>
        </div>

        <Link to={`/roster/${player.id}`} className="btn btn-primary" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
          View full profile
        </Link>
      </div>
    </div>
  )
}
