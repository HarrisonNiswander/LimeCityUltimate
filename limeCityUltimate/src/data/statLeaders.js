import players from './players.js'

// ---------------------------------------------------------------
// All-time boards are derived straight from each player's season
// totals in players.js, so the two files never fall out of sync.
// Rate stats (completion %, huck %) are computed from the same
// underlying counts.
// ---------------------------------------------------------------
function allTimeFrom(getValue) {
  return players
    .map((p) => ({ player: p.name, value: getValue(p.stats) }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value)
}

const allTime = {
  goals: allTimeFrom((s) => s.goals),
  assists: allTimeFrom((s) => s.assists),
  scores: allTimeFrom((s) => s.goals + s.assists),
  throwAttempts: allTimeFrom((s) => s.throwAttempts),
  throwaways: allTimeFrom((s) => s.throwaways),
  completionPct: allTimeFrom((s) => Math.round(((s.throwAttempts - s.throwaways) / s.throwAttempts) * 1000) / 10),
  hucksAttempted: allTimeFrom((s) => s.hucksAttempted),
  hucksCaught: allTimeFrom((s) => s.hucksCaught),
  huckPct: allTimeFrom((s) => Math.round((s.hucksCaught / s.hucksAttempted) * 1000) / 10),
  plusMinus: allTimeFrom((s) => s.plusMinus),
  blocks: allTimeFrom((s) => s.blocks),
  callahans: allTimeFrom((s) => s.callahans),
}

// ---------------------------------------------------------------
// Single-game boards are individual box-score performances.
// These are hand-entered placeholders — replace with real box
// scores as games are played. Keep each array sorted by value,
// descending; ties (equal values) are detected automatically by
// the leaderboard util, so list them back-to-back.
// ---------------------------------------------------------------
const singleGame = {
  goals: [
    { player: 'Priya Natarajan', value: 7, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Elena Cruz', value: 6, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Priya Natarajan', value: 6, opponent: 'Prairie Fire', date: '2026-03-14' },
    { player: 'Naomi Osei', value: 5, opponent: 'Chicago Wind', date: '2026-06-20' },
    { player: 'Elena Cruz', value: 5, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Sofia Lindqvist', value: 4, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Devon Ashby', value: 4, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Priya Natarajan', value: 4, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Jordan Ames', value: 3, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Elena Cruz', value: 3, opponent: 'Hoosier Heat', date: '2026-04-04' },
  ],
  assists: [
    { player: 'Marcus Webb', value: 8, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Theo Barrington', value: 7, opponent: 'Prairie Fire', date: '2026-03-14' },
    { player: 'Jordan Ames', value: 6, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Marcus Webb', value: 6, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Theo Barrington', value: 5, opponent: 'Motor City Rust', date: '2026-06-21' },
    { player: 'Devon Ashby', value: 5, opponent: 'Chicago Wind', date: '2026-06-20' },
    { player: 'Jordan Ames', value: 4, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Marcus Webb', value: 4, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Theo Barrington', value: 3, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Devon Ashby', value: 3, opponent: 'Steel City Sky', date: '2026-03-15' },
  ],
  scores: [
    { player: 'Priya Natarajan', value: 8, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Elena Cruz', value: 7, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Marcus Webb', value: 7, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Naomi Osei', value: 6, opponent: 'Chicago Wind', date: '2026-06-20' },
    { player: 'Jordan Ames', value: 6, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Devon Ashby', value: 5, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Theo Barrington', value: 5, opponent: 'Prairie Fire', date: '2026-03-14' },
    { player: 'Sofia Lindqvist', value: 4, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Priya Natarajan', value: 4, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Elena Cruz', value: 4, opponent: 'Motor City Rust', date: '2026-06-21' },
  ],
  throwAttempts: [
    { player: 'Jordan Ames', value: 42, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Marcus Webb', value: 39, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Theo Barrington', value: 36, opponent: 'Prairie Fire', date: '2026-03-14' },
    { player: 'Jordan Ames', value: 35, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Marcus Webb', value: 33, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Theo Barrington', value: 31, opponent: 'Chicago Wind', date: '2026-06-20' },
    { player: 'Devon Ashby', value: 28, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Jordan Ames', value: 27, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Marcus Webb', value: 25, opponent: 'Motor City Rust', date: '2026-06-21' },
    { player: 'Theo Barrington', value: 24, opponent: 'Steel City Sky', date: '2026-03-15' },
  ],
  throwaways: [
    { player: 'Jordan Ames', value: 5, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Marcus Webb', value: 4, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Theo Barrington', value: 4, opponent: 'Prairie Fire', date: '2026-03-14' },
    { player: 'Devon Ashby', value: 3, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Jordan Ames', value: 3, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Marcus Webb', value: 2, opponent: 'Chicago Wind', date: '2026-06-20' },
    { player: 'Naomi Osei', value: 2, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Theo Barrington', value: 1, opponent: 'Motor City Rust', date: '2026-06-21' },
    { player: 'Priya Natarajan', value: 1, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Elena Cruz', value: 1, opponent: 'Steel City Sky', date: '2026-03-15' },
  ],
  completionPct: [
    { player: 'Theo Barrington', value: 100, opponent: 'Motor City Rust', date: '2026-06-21' },
    { player: 'Marcus Webb', value: 97, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Jordan Ames', value: 96, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Theo Barrington', value: 95, opponent: 'Prairie Fire', date: '2026-03-14' },
    { player: 'Devon Ashby', value: 94, opponent: 'Chicago Wind', date: '2026-06-20' },
    { player: 'Marcus Webb', value: 93, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Jordan Ames', value: 92, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Naomi Osei', value: 91, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Priya Natarajan', value: 90, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Elena Cruz', value: 90, opponent: 'Hoosier Heat', date: '2026-04-04' },
  ],
  hucksAttempted: [
    { player: 'Marcus Webb', value: 7, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Theo Barrington', value: 6, opponent: 'Prairie Fire', date: '2026-03-14' },
    { player: 'Jordan Ames', value: 6, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Marcus Webb', value: 5, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Theo Barrington', value: 5, opponent: 'Chicago Wind', date: '2026-06-20' },
    { player: 'Devon Ashby', value: 4, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Jordan Ames', value: 4, opponent: 'Motor City Rust', date: '2026-06-21' },
    { player: 'Marcus Webb', value: 3, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Theo Barrington', value: 3, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Devon Ashby', value: 2, opponent: 'Hoosier Heat', date: '2026-04-04' },
  ],
  hucksCaught: [
    { player: 'Priya Natarajan', value: 5, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Elena Cruz', value: 4, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Naomi Osei', value: 4, opponent: 'Chicago Wind', date: '2026-06-20' },
    { player: 'Priya Natarajan', value: 3, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Sofia Lindqvist', value: 3, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Elena Cruz', value: 2, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Devon Ashby', value: 2, opponent: 'Motor City Rust', date: '2026-06-21' },
    { player: 'Naomi Osei', value: 1, opponent: 'Prairie Fire', date: '2026-03-14' },
    { player: 'Priya Natarajan', value: 1, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Sofia Lindqvist', value: 1, opponent: 'Steel City Sky', date: '2026-03-15' },
  ],
  huckPct: [
    { player: 'Priya Natarajan', value: 100, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Naomi Osei', value: 100, opponent: 'Chicago Wind', date: '2026-06-20' },
    { player: 'Elena Cruz', value: 90, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Sofia Lindqvist', value: 85, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Devon Ashby', value: 80, opponent: 'Motor City Rust', date: '2026-06-21' },
    { player: 'Elena Cruz', value: 75, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Priya Natarajan', value: 70, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Naomi Osei', value: 65, opponent: 'Prairie Fire', date: '2026-03-14' },
    { player: 'Sofia Lindqvist', value: 60, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Devon Ashby', value: 55, opponent: 'Hoosier Heat', date: '2026-04-04' },
  ],
  plusMinus: [
    { player: 'Priya Natarajan', value: 9, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Marcus Webb', value: 8, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Naomi Osei', value: 7, opponent: 'Prairie Fire', date: '2026-03-14' },
    { player: 'Elena Cruz', value: 7, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Jordan Ames', value: 6, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Devon Ashby', value: 5, opponent: 'Chicago Wind', date: '2026-06-20' },
    { player: 'Theo Barrington', value: 5, opponent: 'Prairie Fire', date: '2026-03-14' },
    { player: 'Marcus Webb', value: 4, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Sofia Lindqvist', value: 3, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Priya Natarajan', value: 2, opponent: 'Steel City Sky', date: '2026-03-15' },
  ],
  blocks: [
    { player: 'Naomi Osei', value: 6, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Naomi Osei', value: 5, opponent: 'Prairie Fire', date: '2026-03-14' },
    { player: 'Marcus Webb', value: 4, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Elena Cruz', value: 4, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Priya Natarajan', value: 3, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Devon Ashby', value: 3, opponent: 'Chicago Wind', date: '2026-06-20' },
    { player: 'Naomi Osei', value: 2, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Marcus Webb', value: 2, opponent: 'Motor City Rust', date: '2026-06-21' },
    { player: 'Jordan Ames', value: 1, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Theo Barrington', value: 1, opponent: 'Hoosier Heat', date: '2026-04-04' },
  ],
  callahans: [
    { player: 'Elena Cruz', value: 1, opponent: 'Riverbend Rift', date: '2026-04-05' },
    { player: 'Priya Natarajan', value: 1, opponent: 'Prairie Fire', date: '2026-05-02' },
    { player: 'Naomi Osei', value: 1, opponent: 'Hoosier Heat', date: '2026-04-04' },
    { player: 'Marcus Webb', value: 1, opponent: 'Chicago Wind', date: '2026-06-20' },
    { player: 'Devon Ashby', value: 1, opponent: 'Steel City Sky', date: '2026-03-15' },
    { player: 'Priya Natarajan', value: 1, opponent: 'Motor City Rust', date: '2026-06-21' },
  ],
}

export { allTime, singleGame }
