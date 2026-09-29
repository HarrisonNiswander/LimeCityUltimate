import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Roster from './pages/Roster.jsx'
import PlayerProfile from './pages/PlayerProfile.jsx'
import Stats from './pages/Stats.jsx'
import StatsGame from './pages/StatsGame.jsx'
import Records from './pages/Records.jsx'
import RecordStat from './pages/RecordStat.jsx'
import GameHistory from './pages/GameHistory.jsx'
import Youtube from './pages/Youtube.jsx'
import TournamentResults from './pages/TournamentResults.jsx'
import TournamentDetail from './pages/TournamentDetail.jsx'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/roster/:playerId" element={<PlayerProfile />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/stats/history" element={<GameHistory />} />
          <Route path="/stats/:gameId" element={<StatsGame />} />
          <Route path="/records" element={<Records />} />
          <Route path="/records/:statId" element={<RecordStat />} />
          <Route path="/youtube" element={<Youtube />} />
          <Route path="/tournaments" element={<TournamentResults />} />
          <Route path="/tournaments/:tournamentId" element={<TournamentDetail />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}