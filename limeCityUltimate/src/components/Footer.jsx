export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--turf-line)', marginTop: 64 }}>
      <div className="wrap" style={{
        padding: '32px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        color: 'var(--muted)',
        fontSize: '0.85rem',
      }}>
        <span>© {new Date().getFullYear()} Lime City Ultimate</span>
        <span>Huntington, Indiana</span>
      </div>
    </footer>
  )
}
