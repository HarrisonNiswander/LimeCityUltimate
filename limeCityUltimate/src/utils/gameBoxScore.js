import singleGameLog from '../data/singleGameLog.js'

// Every player's stats for one specific game. Prefers an exact match via
// tournament + date + the spreadsheet's own game number (the import script
// always sets these); falls back to matching by (date, opponent) for games
// that don't have that information — e.g. hand-entered ones — which can be
// ambiguous if the same opponent was played more than once on the same day.
export function getGameBoxScore(game) {
  if (game.sourceGameNumber !== undefined) {
    const exact = singleGameLog.filter((row) =>
      row.tournament === game.tournament &&
      row.date === game.date &&
      row.sourceGameNumber === game.sourceGameNumber
    )
    if (exact.length > 0) return exact
  }

  return singleGameLog.filter((row) => row.date === game.date && row.opponent === game.opponent)
}
