// Turns a list of entries (already sorted descending by value) into ranked
// rows using "competition ranking": tied values share a rank, and the next
// distinct value skips ahead accordingly (1, 2, 2, 4...).
// Each returned row gets `rank` and `tie` (true for every row after the
// first at that rank) so the UI can render a slim "tie" row underneath.
export function withRanks(entries) {
  let displayRank = 0
  let lastValue = null

  return entries.map((entry, i) => {
    if (i === 0 || entry.value !== lastValue) {
      displayRank = i + 1
      lastValue = entry.value
      return { ...entry, rank: displayRank, tie: false }
    }
    return { ...entry, rank: displayRank, tie: true }
  })
}

export function medalClass(rank) {
  if (rank === 1) return 'medal-gold'
  if (rank === 2) return 'medal-silver'
  if (rank === 3) return 'medal-bronze'
  return ''
}
