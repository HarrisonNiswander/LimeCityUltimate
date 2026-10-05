import players from '../data/players.js'
import { singleGame, allTime, computeAllTimeValue } from '../data/statLeaders.js'
import { withRanks } from './leaderboard.js'
import singleGameLog from '../data/singleGameLog.js'

// Rate stats show "N/A" rather than "0" when a player has no attempts to
// base a percentage on — see getAllTimeValue below.
const RATE_STAT_IDS = new Set(['completionPct', 'huckPct'])

// Throwaways is the one stat where a lower single-game number is the
// better performance — see getSingleGameBest below.
const LOWER_IS_BETTER_IDS = new Set(['throwaways'])

// "scores" isn't stored directly in singleGameLog — it's goals + assists,
// same convention as everywhere else on the site.
function statValueFromLogRow(row, statId) {
  if (statId === 'scores') {
    if (row.goals === undefined && row.assists === undefined) return undefined
    return (row.goals || 0) + (row.assists || 0)
  }
  return row[statId]
}

// The player's best individual single-game performance in a given stat,
// searched across every game they've played — not just the team-wide top
// 10 for that stat (singleGame[statId] only holds the 10 best performances
// on the whole roster, so most players' personal bests wouldn't show up
// there even though they definitely played that stat in some game).
export function getSingleGameBest(playerName, statId) {
  const own = singleGameLog
    .filter((row) => row.player === playerName)
    .map((row) => ({ row, value: statValueFromLogRow(row, statId) }))
    .filter(({ value }) => value !== undefined)

  if (!own.length) return null

  const lowerIsBetter = LOWER_IS_BETTER_IDS.has(statId)
  const { row, value } = own.reduce((best, cur) => {
    const curIsBetter = lowerIsBetter ? cur.value < best.value : cur.value > best.value
    return curIsBetter ? cur : best
  }, own[0])

  return { ...row, value }
}

// The player's club-wide rank (1st, 2nd, 3rd...) for this single-game value.
// Ties share a rank, same as the main leaderboards. Returns null if this
// value doesn't appear in the top-10 leaderboard for the stat (it may not
// meet that stat's minimum-attempts qualifier, for example).
export function getSingleGameRank(playerName, statId, value) {
  const rows = singleGame[statId] || []
  if (!rows.length) return null
  const match = withRanks(rows).find((r) => r.player === playerName && r.value === value)
  return match ? match.rank : null
}

export function isSingleGameRecord(playerName, statId, value) {
  return getSingleGameRank(playerName, statId, value) === 1
}

// The player's true career number for a stat, computed directly from their
// season totals — NOT filtered by a leaderboard's minimum-attempts
// qualifier, so e.g. a player under the throwaways minimum still sees their
// real throwaway count here (they just won't have a rank/medal for it).
// For completion % / huck %, 0 attempts means there's no rate to show, so
// this returns null (rendered as "N/A") rather than 0 in that case.
export function getAllTimeValue(playerName, statId) {
  const player = players.find((p) => p.name === playerName)
  if (!player) return RATE_STAT_IDS.has(statId) ? null : 0
  return computeAllTimeValue(player.stats, statId)
}

// The player's club-wide rank (1st, 2nd, 3rd...) for their career total.
// Returns null if this value doesn't appear on the (minimum-attempts-
// filtered) leaderboard — note that for throwaways, 0 is a perfectly valid
// rank-1 value, so this doesn't treat value === 0 as "no rank" the way it
// would for a stat where 0 just means "never recorded."
export function getAllTimeRank(playerName, statId, value) {
  const rows = allTime[statId] || []
  if (!rows.length || value === null || value === undefined) return null
  const match = withRanks(rows).find((r) => r.player === playerName && r.value === value)
  return match ? match.rank : null
}

export function isAllTimeRecord(playerName, statId, value) {
  return getAllTimeRank(playerName, statId, value) === 1
}
