import players from './players.js'
import singleGameLog from './singleGameLog.js'

// ---------------------------------------------------------------
// The single place that knows how to turn a player's raw season stats
// into each stat category's value — shared by the all-time leaderboard
// below AND by a player's own profile page (playerRecords.js), so a
// player's "All-time stats" always shows their true number even if they
// don't meet a leaderboard's minimum-attempts qualifier.
// ---------------------------------------------------------------
export function computeAllTimeValue(stats, statId) {
  switch (statId) {
    case 'goals': return stats.goals
    case 'assists': return stats.assists
    case 'scores': return stats.goals + stats.assists
    case 'throwAttempts': return stats.throwAttempts
    case 'throwaways': return stats.throwaways
    case 'completionPct':
      return stats.throwAttempts > 0
        ? Math.round(((stats.throwAttempts - stats.throwaways) / stats.throwAttempts) * 1000) / 10
        : null
    case 'hucksAttempted': return stats.hucksAttempted
    case 'hucksCaught': return stats.hucksCaught
    case 'huckPct':
      return stats.hucksAttempted > 0
        ? Math.round((stats.hucksCaught / stats.hucksAttempted) * 1000) / 10
        : null
    case 'plusMinus': return stats.plusMinus
    case 'blocks': return stats.blocks
    case 'callahans': return stats.callahans
    default: return null
  }
}

// By default, a value of 0 is treated as "nobody's done this" rather than
// a real record, so it's excluded from the leaderboard — if that leaves
// the board empty, the UI shows "N/A" instead of a misleading leader.
// Throwaways is the one stat where lower is better, so it's sorted
// ascending and 0 (the best possible outcome) is explicitly kept.
function allTimeFrom(statId, {
  meetsMinimum = () => true,
  ascending = false,
  excludeZero = true,
} = {}) {
  return players
    .map((p) => ({ player: p.name, value: computeAllTimeValue(p.stats, statId), stats: p.stats }))
    .filter((row) => row.value !== null && meetsMinimum(row.stats))
    .filter((row) => !excludeZero || row.value !== 0)
    .sort((a, b) => (ascending ? a.value - b.value : b.value - a.value))
    .map(({ player, value }) => ({ player, value }))
}

const allTime = {
  goals: allTimeFrom('goals'),
  assists: allTimeFrom('assists'),
  scores: allTimeFrom('scores'),
  throwAttempts: allTimeFrom('throwAttempts'),
  // Lower is better — ranked ascending, 0 throwaways (the best possible
  // outcome) is kept. Only counts with at least 25 career throw attempts.
  throwaways: allTimeFrom('throwaways', {
    meetsMinimum: (s) => s.throwAttempts >= 25,
    ascending: true,
    excludeZero: false,
  }),
  // Only counts with at least 25 career throw attempts.
  completionPct: allTimeFrom('completionPct', {
    meetsMinimum: (s) => s.throwAttempts >= 25,
  }),
  hucksAttempted: allTimeFrom('hucksAttempted'),
  hucksCaught: allTimeFrom('hucksCaught'),
  // Only counts with at least 5 career huck attempts.
  huckPct: allTimeFrom('huckPct', {
    meetsMinimum: (s) => s.hucksAttempted >= 5,
  }),
  plusMinus: allTimeFrom('plusMinus'),
  blocks: allTimeFrom('blocks'),
  callahans: allTimeFrom('callahans'),
}

// ---------------------------------------------------------------
// Single-game boards are derived from singleGameLog.js — one row per
// player per game. To add a game's stats, add rows there; nothing
// here needs to change. Same zero-exclusion and ascending-for-
// throwaways rules as the all-time boards above.
// ---------------------------------------------------------------
const MAX_SINGLE_GAME_ROWS = 10

function buildSingleGame(statId, {
  getValue = (row) => row[statId],
  meetsMinimum = () => true,
  ascending = false,
  excludeZero = true,
} = {}) {
  return singleGameLog
    .map((row) => ({ row, value: getValue(row) }))
    .filter(({ row, value }) => value !== undefined && value !== null && meetsMinimum(row))
    .filter(({ value }) => !excludeZero || value !== 0)
    .map(({ row, value }) => ({ player: row.player, value, opponent: row.opponent, date: row.date }))
    .sort((a, b) => (ascending ? a.value - b.value : b.value - a.value))
    .slice(0, MAX_SINGLE_GAME_ROWS)
}

const singleGame = {
  goals: buildSingleGame('goals'),
  assists: buildSingleGame('assists'),
  scores: buildSingleGame('scores', {
    getValue: (row) => (row.goals !== undefined || row.assists !== undefined)
      ? (row.goals || 0) + (row.assists || 0)
      : undefined,
  }),
  throwAttempts: buildSingleGame('throwAttempts'),
  // Lower is better, 0 is kept. Only counts with at least 7 throw
  // attempts in that game.
  throwaways: buildSingleGame('throwaways', {
    meetsMinimum: (row) => (row.throwAttempts || 0) >= 7,
    ascending: true,
    excludeZero: false,
  }),
  // Only counts with at least 7 throw attempts in that game.
  completionPct: buildSingleGame('completionPct', {
    meetsMinimum: (row) => (row.throwAttempts || 0) >= 7,
  }),
  hucksAttempted: buildSingleGame('hucksAttempted'),
  hucksCaught: buildSingleGame('hucksCaught'),
  // Only counts with at least 2 huck attempts in that game.
  huckPct: buildSingleGame('huckPct', {
    meetsMinimum: (row) => (row.hucksAttempted || 0) >= 2,
  }),
  plusMinus: buildSingleGame('plusMinus'),
  blocks: buildSingleGame('blocks'),
  callahans: buildSingleGame('callahans'),
}

export { allTime, singleGame }
