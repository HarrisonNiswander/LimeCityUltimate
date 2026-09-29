import { singleGame, allTime } from '../data/statLeaders.js'
import { withRanks } from './leaderboard.js'

// The player's best individual single-game performance in a given stat,
// drawn from the top-10 single-game leaderboard for that stat. Returns null
// if their best outing didn't crack the top 10 (not tracked at that level
// of detail in the placeholder data).
export function getSingleGameBest(playerName, statId) {
  const rows = singleGame[statId] || []
  const own = rows.filter((r) => r.player === playerName)
  if (!own.length) return null
  return own.reduce((best, r) => (r.value > best.value ? r : best), own[0])
}

// The player's club-wide rank (1st, 2nd, 3rd...) for this single-game value.
// Ties share a rank, same as the main leaderboards. Returns null if this
// value doesn't appear in the top-10 leaderboard for the stat.
export function getSingleGameRank(playerName, statId, value) {
  const rows = singleGame[statId] || []
  if (!rows.length) return null
  const match = withRanks(rows).find((r) => r.player === playerName && r.value === value)
  return match ? match.rank : null
}

export function isSingleGameRecord(playerName, statId, value) {
  return getSingleGameRank(playerName, statId, value) === 1
}

// The player's career total for a stat, from the all-time leaderboard.
export function getAllTimeValue(playerName, statId) {
  const rows = allTime[statId] || []
  const row = rows.find((r) => r.player === playerName)
  return row ? row.value : 0
}

// The player's club-wide rank (1st, 2nd, 3rd...) for their career total.
export function getAllTimeRank(playerName, statId, value) {
  const rows = allTime[statId] || []
  if (!rows.length || value === 0) return null
  const match = withRanks(rows).find((r) => r.player === playerName && r.value === value)
  return match ? match.rank : null
}

export function isAllTimeRecord(playerName, statId, value) {
  return getAllTimeRank(playerName, statId, value) === 1
}
