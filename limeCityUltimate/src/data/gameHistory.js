import players from './players.js'

const gamesPlayed = players
  .map((p) => ({ player: p.name, value: p.stats.gamesPlayed }))
  .sort((a, b) => b.value - a.value)

const pointsPlayed = players
  .map((p) => ({ player: p.name, value: p.stats.pointsPlayed }))
  .sort((a, b) => b.value - a.value)

export { gamesPlayed, pointsPlayed }
