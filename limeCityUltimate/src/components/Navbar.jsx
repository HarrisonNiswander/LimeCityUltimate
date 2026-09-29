import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './styles/Navbar.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/roster', label: 'Roster' },
  { to: '/stats', label: 'Stats' },
  { to: '/records', label: 'Records' },
  { to: '/youtube', label: 'YouTube' },
  { to: '/tournaments', label: 'Tournaments' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <NavLink to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <span className="nav-disc" aria-hidden="true" />
          <span className="nav-brand-text">
            LIME CITY<span className="nav-brand-sub">ULTIMATE</span>
          </span>
        </NavLink>

        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <nav className={`nav-links ${open ? 'is-open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
