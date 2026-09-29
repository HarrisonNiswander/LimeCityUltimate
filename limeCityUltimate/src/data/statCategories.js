// Metadata only — the actual leaderboard numbers live in statLeaders.js.
// Add a stat here and to statLeaders.js and it appears in the Records
// directory and the Stats page leader tables automatically.
const statCategories = [
  { id: 'goals', label: 'Goals', group: 'offensive' },
  { id: 'assists', label: 'Assists', group: 'offensive' },
  { id: 'scores', label: 'Scores', group: 'offensive', note: 'Goals + assists' },
  { id: 'throwAttempts', label: 'Total Throw Attempts', group: 'offensive' },
  { id: 'throwaways', label: 'Throwaways', group: 'offensive', note: 'Min. 7 attempts' },
  { id: 'completionPct', label: 'Completion %', group: 'offensive', suffix: '%' },
  { id: 'hucksAttempted', label: 'Hucks Attempted', group: 'offensive' },
  { id: 'hucksCaught', label: 'Hucks Caught', group: 'offensive' },
  { id: 'huckPct', label: 'Huck %', group: 'offensive', suffix: '%', note: 'Min. 2 attempts' },
  { id: 'plusMinus', label: 'Plus/Minus', group: 'offensive' },
  { id: 'blocks', label: 'Blocks', group: 'defensive' },
  { id: 'callahans', label: 'Callahans', group: 'defensive' },
]

export default statCategories
