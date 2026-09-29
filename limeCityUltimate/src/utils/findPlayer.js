import players from '../data/players.js'

export function findPlayer(name) {
  return players.find((p) => p.name === name) || null
}
