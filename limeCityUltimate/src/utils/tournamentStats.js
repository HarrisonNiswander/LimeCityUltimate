import games from '../data/games.js'
import singleGameLog from '../data/singleGameLog.js'

// Every player who appeared in a tournament, with their goals, assists,
// blocks, and plus/minus summed across every game at that tournament, plus
// which team/squad they played on.
//
// Prefers rows that directly record their own tournament (every row the
// import script writes has this); falls back to matching via games.js's
// (date, opponent) pairs for older rows that don't have it.
export function getTournamentPlayerTotals(tournamentName) {
  const directRows = singleGameLog.filter((row) => row.tournament === tournamentName)

  const dateOpponentKeys = new Set(
    games
      .filter((g) => g.tournament === tournamentName)
      .map((g) => `${g.date}__${g.opponent}`)
  )
  const fallbackRows = singleGameLog.filter((row) =>
    row.tournament === undefined && dateOpponentKeys.has(`${row.date}__${row.opponent}`)
  )

  const totals = new Map() // player -> { player, team, goals, assists, blocks, plusMinus }

  ;[...directRows, ...fallbackRows].forEach((row) => {
    if (!totals.has(row.player)) {
      totals.set(row.player, { player: row.player, team: row.team, goals: 0, assists: 0, blocks: 0, plusMinus: 0 })
    }
    const t = totals.get(row.player)
    if (row.team) t.team = row.team // keep the most recently seen team
    t.goals += row.goals || 0
    t.assists += row.assists || 0
    t.blocks += row.blocks || 0
    t.plusMinus += row.plusMinus || 0
  })

  return Array.from(totals.values()).sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))
}
