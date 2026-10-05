// One row per player, per game they appeared in — the single source of truth
// for single-game stats. statLeaders.js derives each stat's top-10 leaderboard
// from this list, so adding a game here is all that's needed to update every
// single-game leaderboard, stat page, and player profile at once.
//
// Fields beyond player/team/opponent/date are optional — omit a stat entirely
// for a player/game if it wasn't tracked that game (it just won't appear in
// that stat's leaderboard). `scores` is NOT stored here; it's goals + assists,
// computed automatically wherever it's needed.
//
// `tournament` and `sourceGameNumber` are optional too — when present (the
// import script always fills them in), they let the site match a row to one
// exact game. Without them, matching falls back to (date, opponent), which
// is ambiguous if the same opponent was played more than once on the same
// day (common in scrimmages) — that's why older hand-entered rows here don't
// have them, but new ones from the importer always will.
const singleGameLog = [
  { player: 'Naomi Osei', team: 'Lime City', opponent: 'Prairie Fire', date: '2026-03-14', hucksAttempted: 2, hucksCaught: 1, huckPct: 65, plusMinus: 7, blocks: 5 },
  { player: 'Priya Natarajan', team: 'Lime City', opponent: 'Prairie Fire', date: '2026-03-14', goals: 6 },
  { player: 'Theo Barrington', team: 'Lime City', opponent: 'Prairie Fire', date: '2026-03-14', assists: 7, throwAttempts: 36, throwaways: 4, completionPct: 95, hucksAttempted: 6, plusMinus: 5 },
  { player: 'Devon Ashby', team: 'Lime City', opponent: 'Steel City Sky', date: '2026-03-15', assists: 3, throwAttempts: 24, throwaways: 3, hucksAttempted: 4, callahans: 1 },
  { player: 'Elena Cruz', team: 'Lime City', opponent: 'Steel City Sky', date: '2026-03-15', goals: 5, throwAttempts: 15, throwaways: 1, blocks: 4 },
  { player: 'Jordan Ames', team: 'Lime City', opponent: 'Steel City Sky', date: '2026-03-15', assists: 6, throwAttempts: 35, completionPct: 92, plusMinus: 6, blocks: 1 },
  { player: 'Marcus Webb', team: 'Lime City', opponent: 'Steel City Sky', date: '2026-03-15', hucksAttempted: 3 },
  { player: 'Priya Natarajan', team: 'Lime City', opponent: 'Steel City Sky', date: '2026-03-15', goals: 4, hucksAttempted: 4, hucksCaught: 3, huckPct: 70, plusMinus: 2 },
  { player: 'Sofia Lindqvist', team: 'Lime City', opponent: 'Steel City Sky', date: '2026-03-15', hucksAttempted: 2, hucksCaught: 1, huckPct: 60 },
  { player: 'Theo Barrington', team: 'Lime City', opponent: 'Steel City Sky', date: '2026-03-15', throwAttempts: 24 },
  { player: 'Devon Ashby', team: 'Lime City', opponent: 'Hoosier Heat', date: '2026-04-04', goals: 4, hucksAttempted: 2, huckPct: 55 },
  { player: 'Elena Cruz', team: 'Lime City', opponent: 'Hoosier Heat', date: '2026-04-04', goals: 3, completionPct: 90, hucksAttempted: 3, hucksCaught: 2, huckPct: 75 },
  { player: 'Jordan Ames', team: 'Lime City', opponent: 'Hoosier Heat', date: '2026-04-04', throwAttempts: 27, throwaways: 5 },
  { player: 'Marcus Webb', team: 'Lime City', opponent: 'Hoosier Heat', date: '2026-04-04', assists: 4, throwAttempts: 33, completionPct: 93, hucksAttempted: 5, plusMinus: 4 },
  { player: 'Naomi Osei', team: 'Lime City', opponent: 'Hoosier Heat', date: '2026-04-04', throwAttempts: 10, throwaways: 2, callahans: 1 },
  { player: 'Priya Natarajan', team: 'Lime City', opponent: 'Hoosier Heat', date: '2026-04-04', hucksCaught: 1, blocks: 3 },
  { player: 'Theo Barrington', team: 'Lime City', opponent: 'Hoosier Heat', date: '2026-04-04', blocks: 1 },
  { player: 'Devon Ashby', team: 'Lime City', opponent: 'Riverbend Rift', date: '2026-04-05', throwAttempts: 28 },
  { player: 'Elena Cruz', team: 'Lime City', opponent: 'Riverbend Rift', date: '2026-04-05', goals: 6, hucksAttempted: 4, hucksCaught: 4, huckPct: 90, plusMinus: 7, callahans: 1 },
  { player: 'Marcus Webb', team: 'Lime City', opponent: 'Riverbend Rift', date: '2026-04-05', assists: 8, throwAttempts: 39, throwaways: 4, completionPct: 97, hucksAttempted: 7, plusMinus: 8, blocks: 4 },
  { player: 'Naomi Osei', team: 'Lime City', opponent: 'Riverbend Rift', date: '2026-04-05', completionPct: 91, blocks: 2 },
  { player: 'Priya Natarajan', team: 'Lime City', opponent: 'Riverbend Rift', date: '2026-04-05', throwAttempts: 9, throwaways: 1 },
  { player: 'Sofia Lindqvist', team: 'Lime City', opponent: 'Riverbend Rift', date: '2026-04-05', goals: 4, hucksAttempted: 4, hucksCaught: 3, huckPct: 85, plusMinus: 3 },
  { player: 'Theo Barrington', team: 'Lime City', opponent: 'Riverbend Rift', date: '2026-04-05', assists: 3, hucksAttempted: 3 },
  { player: 'Jordan Ames', team: 'Lime City', opponent: 'Prairie Fire', date: '2026-05-02', goals: 3, assists: 4, throwAttempts: 42, throwaways: 3, completionPct: 96, hucksAttempted: 6 },
  { player: 'Marcus Webb', team: 'Lime City', opponent: 'Prairie Fire', date: '2026-05-02', assists: 6 },
  { player: 'Naomi Osei', team: 'Lime City', opponent: 'Prairie Fire', date: '2026-05-02', blocks: 6 },
  { player: 'Priya Natarajan', team: 'Lime City', opponent: 'Prairie Fire', date: '2026-05-02', goals: 7, completionPct: 90, hucksAttempted: 5, hucksCaught: 5, huckPct: 100, plusMinus: 9, callahans: 1 },
  { player: 'Devon Ashby', team: 'Lime City', opponent: 'Chicago Wind', date: '2026-06-20', assists: 5, completionPct: 94, plusMinus: 5, blocks: 3 },
  { player: 'Marcus Webb', team: 'Lime City', opponent: 'Chicago Wind', date: '2026-06-20', throwAttempts: 9, throwaways: 2, callahans: 1 },
  { player: 'Naomi Osei', team: 'Lime City', opponent: 'Chicago Wind', date: '2026-06-20', goals: 5, hucksAttempted: 4, hucksCaught: 4, huckPct: 100 },
  { player: 'Theo Barrington', team: 'Lime City', opponent: 'Chicago Wind', date: '2026-06-20', throwAttempts: 31, hucksAttempted: 5 },
  { player: 'Devon Ashby', team: 'Lime City', opponent: 'Motor City Rust', date: '2026-06-21', hucksAttempted: 2, hucksCaught: 2, huckPct: 80 },
  { player: 'Elena Cruz', team: 'Lime City', opponent: 'Motor City Rust', date: '2026-06-21' },
  { player: 'Jordan Ames', team: 'Lime City', opponent: 'Motor City Rust', date: '2026-06-21', hucksAttempted: 4 },
  { player: 'Marcus Webb', team: 'Lime City', opponent: 'Motor City Rust', date: '2026-06-21', throwAttempts: 25, blocks: 2 },
  { player: 'Priya Natarajan', team: 'Lime City', opponent: 'Motor City Rust', date: '2026-06-21', callahans: 1 },
  { player: 'Theo Barrington', team: 'Lime City', opponent: 'Motor City Rust', date: '2026-06-21', assists: 5, throwAttempts: 9, throwaways: 1, completionPct: 100 },
]

export default singleGameLog