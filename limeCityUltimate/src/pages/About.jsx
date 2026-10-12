import timeline from '../data/timeline.js'

export default function About() {
  return (
    <div className="page wrap">
      <div className="page-head">
        <div>
          <span className="page-kicker">Our story</span>
          <h1>About the club</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48 }} className="about-grid">
        <div>
          <p style={{ fontSize: '1.1rem', color: 'var(--cream)', lineHeight: 1.7 }}>
            Lime City Ultimate started out as a group of friends who loved playing
            ultimate frisbee. The friendship began through highschool cross country and 
            has continued to grow through the years. Freshman year of highschool, we were introduced 
            to ultimate frisbee and we've been hooked ever since.
            
          </p>
          <br></br>
          <p style={{ fontSize: '1.1rem', color: 'var(--cream)', lineHeight: 1.7 }}>
            Every summer and Christmas break, the team gets together to play frisbee together.
            Each year, the team grows with new people joining and veterans returning.
          </p>
          
        </div>

        <aside style={{ background: 'var(--ink-soft)', border: '1px solid var(--turf-line)', borderRadius: 4, padding: 32, alignSelf: 'start' }}>
          <span className="page-kicker">Club facts</span>
          <dl style={{ display: 'grid', gap: 18, marginTop: 16 }}>
            {[
              ['Founded', '2022'],
              ['Division', 'Open'],
              ['Home field', 'Huntington University'],
              ['Location', 'Huntington, IN'],
              ['Cameras Used', 'Insta360 GO 3 & 3S'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--turf-line)', paddingBottom: 12 }}>
                <dt style={{ color: 'var(--muted)' }}>{k}</dt>
                <dd style={{ margin: 0, color: 'var(--cream)', fontWeight: 600 }}>{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <h2 style={{ fontSize: '1.6rem', color: 'var(--cream)', marginTop: 64, marginBottom: 24 }}>
        Through the years
      </h2>
      <div className="timeline-grid">
        {timeline.map((t) => (
          <div className="timeline-item" key={t.year}>
            <img src={t.image} alt="" className="timeline-image" />
            <span className="page-kicker">{t.year}</span>
            <strong style={{ color: 'var(--cream)', fontSize: '1.05rem' }}>{t.title}</strong>
            <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: '0.92rem' }}>{t.description}</p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 860px) {
          .timeline-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .timeline-grid { grid-template-columns: 1fr; }
        }
        .timeline-item {
          background: var(--ink-soft);
          border: 1px solid var(--turf-line);
          border-radius: 4px;
          overflow: hidden;
          padding-bottom: 16px;
        }
        .timeline-image {
          width: 100%;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          margin-bottom: 14px;
        }
        .timeline-item .page-kicker,
        .timeline-item strong,
        .timeline-item p {
          padding-left: 16px;
          padding-right: 16px;
          display: block;
        }
      `}</style>
    </div>
  )
}
