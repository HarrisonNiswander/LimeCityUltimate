import { Link } from 'react-router-dom'
import tournaments from '../data/tournaments.js'
import { seasonRecords } from '../data/records.js'
import statCategories from '../data/statCategories.js'
import { singleGame } from '../data/statLeaders.js'
import { withRanks } from '../utils/leaderboard.js'
import { findPlayer } from '../utils/findPlayer.js'
import videos from '../data/videos.js'
import './styles/Home.css'

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Every current #1 (record-holding) single-game performance, across every
// stat category, sorted so the most recently set record shows up first.
function getNewestRecords(limit = 4) {
  const records = []

  statCategories.forEach((s) => {
    const rows = singleGame[s.id] || []
    if (!rows.length) return

    withRanks(rows)
      .filter((r) => r.rank === 1)
      .forEach((r) => {
        records.push({
          statId: s.id,
          statLabel: s.label,
          suffix: s.suffix || '',
          player: r.player,
          value: r.value,
          opponent: r.opponent,
          date: r.date,
        })
      })
  })

  return records
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

function getNewestVideos(limit = 6) {
  return [...videos]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

export default function Home() {
  const latestSeason = seasonRecords[0]
  const newestRecords = getNewestRecords(4)
  const newestVideos = getNewestVideos(6)

  return (
    <>
      <section className="hero">
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <span className="page-kicker">Huntington, Indiana · Open Division</span>
            <h1 className="hero-title">
              LIME CITY
              <br />
              ULTIMATE
            </h1>
            <p className="hero-sub">
              A club built on hard cuts, harder discipline, and a bench that never stops
              cheering. Follow the {latestSeason.season} season — roster, box scores, and film,
              all in one place.
            </p>
            <div className="hero-actions">
              <Link to="/roster" className="btn btn-primary">Meet the roster</Link>
              <Link to="/youtube" className="btn btn-ghost">Watch highlights</Link>
            </div>
          </div>
          <div className="hero-disc-wrap" aria-hidden="true">
            <div className="hero-disc" />
          </div>
        </div>
      </section>

      <br></br>

      <section className="wrap home-section">
        <div className="page-head" style={{ marginBottom: 32 }}>
          <div>
            <span className="page-kicker">Freshly Set</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>Newest Records Broken</h2>
          </div>
          <Link to="/records" className="btn btn-ghost">All records</Link>
        </div>

        <div className="home-record-grid">
          {newestRecords.map((r) => {
            const player = findPlayer(r.player)
            return (
              <Link
                to={player ? `/roster/${player.id}` : '/roster'}
                key={`${r.statId}-${r.player}-${r.date}`}
                className="home-record-card"
              >
                <span className="page-kicker">{formatDate(r.date)}</span>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--cream)', marginTop: 6 }}>{r.player}</h3>
                <p style={{ color: 'var(--muted)', marginTop: 4 }}>vs. {r.opponent}</p>
                <div className="home-record-meta">
                  <span>{r.statLabel}</span>
                  <span>{r.value}{r.suffix}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <br></br><br></br>

      <section className="wrap home-section">
        <div className="page-head" style={{ marginBottom: 32 }}>
          <div>
            <span className="page-kicker">Fresh off the Camera</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>Newest YouTube Videos</h2>
          </div>
          <Link to="/youtube" className="btn btn-ghost">All videos</Link>
        </div>

        <div className="home-video-grid">
          {newestVideos.map((v) => (
            <a
              href={`https://www.youtube.com/watch?v=${v.videoId}`}
              target="_blank"
              rel="noreferrer"
              key={v.id}
              className="home-video-card"
            >
              <span className="home-video-thumb-wrap">
                <img
                  src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                  alt=""
                  className="home-video-thumb"
                />
                <span className="home-video-play" aria-hidden="true">▶</span>
              </span>
              <strong style={{ color: 'var(--cream)', fontSize: '0.98rem' }}>{v.title}</strong>
              <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{formatDate(v.date)}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
