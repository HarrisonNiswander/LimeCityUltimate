export default function VideoCard({ video, onSelect }) {
  const thumb = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
  const displayDate = new Date(`${video.date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <button className="video-card" onClick={() => onSelect(video)}>
      <span className="video-thumb-wrap">
        <img src={thumb} alt="" className="video-thumb" />
        <span className="video-play" aria-hidden="true">▶</span>
      </span>
      <span className="video-title">{video.title}</span>
      <span className="video-date">{displayDate}</span>
    </button>
  )
}
