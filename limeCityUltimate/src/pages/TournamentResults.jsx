import { Link } from 'react-router-dom'
import tournaments from '../data/tournaments.js'
import './styles/TournamentResults.css'

export default function TournamentResults() {
  return (
    <div className="page wrap">
      <div className="page-head">
        <div>
          <span className="page-kicker">{tournaments.length} events</span>
          <h1>Tournament results</h1>
          <p className="page-sub" style={{ marginTop: 12 }}>
            Tap a tournament for the full write-up, games, and top performers.
          </p>
        </div>
      </div>

      <div className="tourney-timeline">
        {tournaments.map((t, i) => (
          <div className="tourney-item" key={t.id}>
            <div className="tourney-marker">
              <span className="disc" style={{ width: 12, height: 12 }} />
              {i !== tournaments.length - 1 && <span className="tourney-line" />}
            </div>
            <Link to={`/tournaments/${t.id}`} className="tourney-content tourney-content-link">
              <span className="page-kicker">{t.date} · {t.location}</span>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--cream)', marginTop: 6 }}>{t.name}</h2>
              <div className="tourney-tags">
                <span className="tourney-tag tourney-tag-accent">{t.finish}</span>
                <span className="tourney-tag">{t.record}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
