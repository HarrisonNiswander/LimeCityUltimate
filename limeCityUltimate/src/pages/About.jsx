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
            Lime City Ultimate started in 2019 as a pickup group at a Huntington city park and
            has grown into one of the region's most competitive club teams. We play Open
            division, recruit from across northeast Indiana, and compete at Sectionals,
            Regionals, and select invitational tournaments each spring and summer.
          </p>
          <p style={{ marginTop: 20, color: 'var(--muted)', lineHeight: 1.7 }}>
            Practices run Tuesday and Thursday evenings at Foster Park, with weekend
            scrimmages against regional clubs leading into tournament season. New players are
            always welcome at open runs — no experience required, just a willingness to sprint.
          </p>

          <h2 style={{ fontSize: '1.6rem', color: 'var(--cream)', marginTop: 48, marginBottom: 16 }}>
            What we value
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 14 }}>
            {[
              ['Spirit of the Game', 'Ultimate is self-officiated. We hold ourselves to that standard, on and off the field.'],
              ['Development', 'Every roster spot from rookie to captain gets real reps and real feedback.'],
              ['Community', 'We show up for each other — practices, tournaments, and everything between.'],
            ].map(([title, body]) => (
              <li key={title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span className="disc" style={{ width: 10, height: 10, marginTop: 8, flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--cream)' }}>{title}</strong>
                  <p style={{ color: 'var(--muted)', marginTop: 4 }}>{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside style={{ background: 'var(--ink-soft)', border: '1px solid var(--turf-line)', borderRadius: 4, padding: 32, alignSelf: 'start' }}>
          <span className="page-kicker">Club facts</span>
          <dl style={{ display: 'grid', gap: 18, marginTop: 16 }}>
            {[
              ['Founded', '2019'],
              ['Division', 'Open'],
              ['Home field', 'Riverside Park, Huntington'],
              ['Practices', 'Tue & Thu, 6:30 PM'],
              ['Roster size', '20–24 players'],
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
