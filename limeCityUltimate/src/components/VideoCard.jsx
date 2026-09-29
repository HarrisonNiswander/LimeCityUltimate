export default function VideoCard({ video, onSelect }) {
  const thumb = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`

  return (
    <button className="video-card" onClick={() => onSelect(video)}>
      <span className="video-thumb-wrap">
        <img src={thumb} alt="" className="video-thumb" />
        <span className="video-play" aria-hidden="true">▶</span>
      </span>
      <span className="video-title">{video.title}</span>
      <span className="video-date">
        {new Date(video.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
    </button>
  )
}
