import { useState, useEffect } from 'react'
import videos from '../data/videos.js'
import VideoCard from '../components/VideoCard.jsx'
import './styles/YouTube.css'

export default function YouTube() {
  const [playing, setPlaying] = useState(null)

  useEffect(() => {
    if (!playing) return
    const onKey = (e) => { if (e.key === 'Escape') setPlaying(null) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [playing])

  return (
    <div className="page wrap">
      <div className="page-head">
        <div>
          <span className="page-kicker">{videos.length} videos</span>
          <h1>YouTube</h1>
          <p className="page-sub" style={{ marginTop: 12 }}>
            Game film, highlight reels, and behind-the-scenes from the team.
          </p>
        </div>
      </div>

      <div className="video-grid">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} onSelect={setPlaying} />
        ))}
      </div>

      {playing && (
        <div className="modal-backdrop" onClick={() => setPlaying(null)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" style={{ top: -46, right: 0 }} onClick={() => setPlaying(null)} aria-label="Close">✕</button>
            <div className="video-embed-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${playing.videoId}?autoplay=1`}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p style={{ color: 'var(--cream)', marginTop: 16, fontWeight: 600 }}>{playing.title}</p>
          </div>
        </div>
      )}
    </div>
  )
}
