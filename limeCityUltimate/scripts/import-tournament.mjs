#!/usr/bin/env node
/**
 * Import a tournament's Excel file into the site's data files.
 *
 * Usage:
 *   node scripts/import-tournament.mjs path/to/Tournament.xlsx [options]
 *   node scripts/import-tournament.mjs path/to/folder/ [options]
 *
 * Pass a folder instead of a single file to process every .xlsx file inside
 * it in one run (all their games get combined before anything is written,
 * so game/tournament IDs still come out sequential and nothing collides).
 *
 * Options:
 *   --dry-run              Parse and print what would change, but don't write any files.
 *   --skip-scrimmages      Skip games where BOTH squads are your own roster
 *                          (intrasquad scrimmages) instead of treating them as
 *                          a real game. By default, scrimmages count just like
 *                          any other game — every player's stats are merged,
 *                          and the game shows up on the Stats page with the
 *                          other squad standing in as the "opponent".
 *
 * What it expects from the spreadsheet (see README-import.md for the full writeup):
 *   - One sheet per day of the tournament (sheet name doesn't matter, but each
 *     game block must have its own "Date: MM-DD-YY" cell).
 *   - Each game is a block starting with a cell that says exactly "Game: " in
 *     one column and the tournament name in the next column, a "Game: #N" cell
 *     further along the same row, and a "Date: ..." cell on that row too.
 *   - Under that, a "Player Name" row with player names across the columns,
 *     a "Team" row right below it with each player's squad/opponent label,
 *     and stat rows below that labeled exactly: Goals, Assits (sic) or
 *     Assists, Total Throw Attempts, Throwaways, Completion %, Hucks
 *     Attempted, Huck Caught, Huck %, Plus/Minus, Blocks, Callahans, Points
 *     Played, Games Played — one column per player, values below.
 *   - A "Team Stats" section to the right with a "Team" header row naming
 *     each squad and a "Goals" row — that's what's used as each squad's
 *     final score (NOT the "Scores" row there, which is goals + assists).
 *
 * What it does:
 *   - Matches player names in the sheet against src/data/players.js by exact
 *     name. Unmatched names are reported and skipped (add them to the roster
 *     first if they're new).
 *   - Adds each game's per-player numbers into that player's season totals
 *     in players.js (goals, assists, blocks, etc. — only fields actually
 *     present in the sheet are touched).
 *   - Appends one row per player per game to src/data/singleGameLog.js,
 *     which is what powers every single-game leaderboard and stat page.
 *   - Appends a new game to src/data/games.js for every game block, scrimmages
 *     included — the other squad's label (e.g. "Blue") stands in as the
 *     opponent, same as "Prairie Fire" would for a real away game.
 *   - Adds a bare-bones entry to src/data/tournaments.js if this tournament
 *     name isn't already there (you'll still need to fill in location,
 *     finish, and notes by hand afterward — those aren't in the spreadsheet).
 *
 * This script never touches src/data/statLeaders.js — that file derives
 * everything from players.js and singleGameLog.js automatically.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'src', 'data')

const PLAYERS_PATH = path.join(DATA_DIR, 'players.js')
const GAMES_PATH = path.join(DATA_DIR, 'games.js')
const TOURNAMENTS_PATH = path.join(DATA_DIR, 'tournaments.js')
const SINGLE_GAME_LOG_PATH = path.join(DATA_DIR, 'singleGameLog.js')

// Row labels the parser looks for, in the "Individual Player Stats" column.
// Matching is case-insensitive and trims a trailing colon, so small
// formatting differences in the sheet don't break it.
const STAT_LABELS = {
  goals: ['goals'],
  assists: ['assits', 'assists'], // the known template has this typo
  throwAttempts: ['total throw attempts'],
  throwaways: ['throwaways'],
  completionPct: ['completion %'],
  hucksAttempted: ['hucks attempted'],
  hucksCaught: ['huck caught', 'hucks caught'],
  huckPct: ['huck %'],
  plusMinus: ['plus/minus'],
  blocks: ['blocks'],
  callahans: ['callahans'],
  pointsPlayed: ['points played'],
  gamesPlayed: ['games played'],
}

// Fields that accumulate into a player's career totals in players.js.
// (completionPct / huckPct are derived from the attempt counts elsewhere on
// the site, so they're intentionally not summed here.)
const ACCUMULATING_FIELDS = [
  'goals', 'assists', 'throwAttempts', 'throwaways',
  'hucksAttempted', 'hucksCaught', 'plusMinus', 'blocks', 'callahans',
  'gamesPlayed', 'pointsPlayed',
]

function norm(v) {
  if (v === null || v === undefined) return null
  return String(v).trim().toLowerCase().replace(/:$/, '').trim()
}

function parseSheetDate(raw) {
  const m = String(raw).match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/)
  if (!m) return null
  let [, mm, dd, yy] = m
  mm = mm.padStart(2, '0')
  dd = dd.padStart(2, '0')
  if (yy.length === 2) yy = String(Number(yy) < 50 ? 2000 + Number(yy) : 1900 + Number(yy))
  return `${yy}-${mm}-${dd}`
}

// Excel stores a percentage-formatted cell (one showing "95%") as the
// decimal 0.95 underneath, not the number 95 — the xlsx package reads that
// raw decimal, not the displayed text. So a completion-% cell showing 95%
// comes in here as 0.95, and without this conversion it'd get stored (and
// displayed on the site) as "0.95%" instead of "95%". If someone instead
// just typed a plain number like 95 (not a %-formatted cell), it's already
// in the right range and is left alone.
function normalizePercent(v) {
  const n = Number(v)
  if (Number.isNaN(n)) return v
  if (n > 0 && n <= 1) return Math.round(n * 1000) / 10
  return n
}

// ---------------------------------------------------------------
// STEP 1 — read the workbook into "game blocks". This is the only
// part of the script that depends on the `xlsx` package.
// ---------------------------------------------------------------
function parseWorkbook(filePath) {
  // Imported lazily so the rest of this file can be unit-tested without
  // the xlsx package installed.
  const XLSX = requireXlsx()
  const workbook = XLSX.readFile(filePath, { cellDates: false })
  const blocks = []

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const grid = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: true })
    blocks.push(...parseSheetGrid(grid))
  }

  return blocks
}

function requireXlsx() {
  try {
    return require('xlsx')
  } catch (err) {
    console.error(
      '\nCould not load the "xlsx" package. Run `npm install` in the project root first ' +
      '(it is listed in package.json as a devDependency) and try again.\n'
    )
    throw err
  }
}

// ---------------------------------------------------------------
// STEP 2 — turn a sheet's raw grid (array of arrays) into game blocks.
// Pure logic, no xlsx dependency — this is unit-tested directly.
// ---------------------------------------------------------------
export function parseSheetGrid(grid) {
  const maxCol = grid.reduce((m, row) => Math.max(m, row.length), 0)
  const blocks = []

  const markers = []
  grid.forEach((row, r) => {
    row.forEach((val, c) => {
      if (typeof val === 'string' && val.trim().toLowerCase() === 'game:') markers.push([r, c])
    })
  })
  markers.sort((a, b) => a[0] - b[0])

  markers.forEach(([mr, mc], i) => {
    const blockEnd = i + 1 < markers.length ? markers[i + 1][0] - 1 : Math.min(mr + 40, grid.length - 1)
    const row = (r) => grid[r] || []

    const tournamentName = row(mr)[mc + 1] ?? null
    let gameDate = null
    let gameNumber = null
    row(mr).forEach((val) => {
      if (typeof val !== 'string') return
      const dm = val.trim().match(/^date:\s*(.+)/i)
      if (dm) gameDate = parseSheetDate(dm[1])
      const gm = val.trim().match(/^game:\s*#?\s*(\d+)/i)
      if (gm) gameNumber = Number(gm[1])
    })

    // Find the first "Player Name" cell within the block.
    let nameRow = null
    let nameCol = null
    outer: for (let r = mr; r <= blockEnd; r++) {
      const cols = row(r)
      for (let c = 0; c < cols.length; c++) {
        if (norm(cols[c]) === 'player name') {
          nameRow = r
          nameCol = c
          break outer
        }
      }
    }
    if (nameRow === null) return // not a recognizable block, skip it

    // Boundaries on the "Player Name" row: every "player name" or "team"
    // cell marks the edge of a column-group, so the player list for THIS
    // block stops at the next one.
    const headerRow = row(nameRow)
    const boundaries = []
    headerRow.forEach((val, c) => {
      const n = norm(val)
      if (n === 'player name' || n === 'team') boundaries.push(c)
    })
    const nextBoundary = boundaries.find((b) => b > nameCol) ?? maxCol

    const playerCols = []
    for (let c = nameCol + 1; c < nextBoundary; c++) {
      const val = headerRow[c]
      if (val !== null && val !== '') playerCols.push([c, String(val).trim()])
    }

    const teamRowVals = row(nameRow + 1)
    const groups = new Map() // label -> [{col, name}]
    playerCols.forEach(([c, pname]) => {
      const label = teamRowVals[c] != null ? String(teamRowVals[c]).trim() : null
      if (!groups.has(label)) groups.set(label, [])
      groups.get(label).push({ col: c, name: pname })
    })

    // Locate each stat's row within the block, scanned in the SAME column
    // as "Player Name" so we don't pick up the (optional) cumulative-total
    // block elsewhere in the row.
    const statRows = {}
    for (const [key, labels] of Object.entries(STAT_LABELS)) {
      for (let r = nameRow; r <= blockEnd; r++) {
        if (labels.includes(norm(row(r)[nameCol]))) {
          statRows[key] = r
          break
        }
      }
    }

    // Team Stats section: the "team" boundary cell itself starts it. The
    // final score for the game is the "Goals" row, NOT the "Scores" row —
    // "Scores" (as used elsewhere in this template) means goals + assists,
    // which at the team level comes out to roughly double the real score,
    // since almost every goal has a corresponding assist. A real ultimate
    // score is just the goal count.
    let teamScores = {}
    if (headerRow[nextBoundary] !== undefined && norm(headerRow[nextBoundary]) === 'team') {
      let goalsRow = null
      for (let r = nameRow; r <= blockEnd; r++) {
        if (norm(row(r)[nextBoundary]) === 'goals') {
          goalsRow = r
          break
        }
      }
      if (goalsRow !== null) {
        let cc = nextBoundary + 1
        while (cc < maxCol && headerRow[cc] !== null && headerRow[cc] !== '') {
          teamScores[String(headerRow[cc]).trim()] = row(goalsRow)[cc]
          cc += 1
        }
      }
    }

    const PERCENT_KEYS = new Set(['completionPct', 'huckPct'])

    const players = {}
    for (const [label, members] of groups.entries()) {
      members.forEach(({ col, name }) => {
        const stats = { team: label }
        for (const [key, r] of Object.entries(statRows)) {
          let v = row(r)[col]
          if (v !== null && v !== undefined) {
            if (PERCENT_KEYS.has(key)) v = normalizePercent(v)
            stats[key] = v
          }
        }
        players[name] = stats
      })
    }

    blocks.push({
      tournament: tournamentName,
      gameNumber,
      date: gameDate,
      groups: Object.fromEntries(Array.from(groups.entries()).map(([k, v]) => [k, v.map((m) => m.name)])),
      teamScores,
      players,
    })
  })

  return blocks
}

// ---------------------------------------------------------------
// STEP 3 — turn game blocks into file updates. Pure logic, no xlsx
// dependency — this is unit-tested directly.
// ---------------------------------------------------------------
// Builds the key used to recognize "this exact game has already been
// imported." Tournament + date + the spreadsheet's own "Game: #N" number
// uniquely identifies a game even when the same two squads play more than
// once on the same day (common in scrimmages) — date + opponent alone
// isn't enough to tell those apart.
function gameDedupKey(tournament, date, gameNumber) {
  if (gameNumber === null || gameNumber === undefined) return null
  return `${tournament ?? ''}__${date ?? ''}__${gameNumber}`
}

export function computeUpdates(gameBlocks, { roster, skipScrimmages = false, existingGameKeys = new Set() }) {
  const rosterNames = new Set(roster.map((p) => p.name))
  const singleGameRows = []
  const playerDeltas = new Map() // name -> { field: total }
  const gameEntries = []
  const tournamentNamesSeen = new Set()
  const tournamentStubs = []
  const warnings = []
  const seenKeys = new Set(existingGameKeys) // grows as this run accepts new games, so duplicates within one run are also caught

  function addDelta(name, field, amount) {
    if (!playerDeltas.has(name)) playerDeltas.set(name, {})
    const d = playerDeltas.get(name)
    d[field] = (d[field] || 0) + amount
  }

  gameBlocks.forEach((block, idx) => {
    const label = `Game ${block.gameNumber ?? idx + 1} (${block.tournament ?? 'unknown tournament'}, ${block.date ?? 'no date'})`
    const groupLabels = Object.keys(block.groups)

    if (groupLabels.length === 0) {
      warnings.push(`${label}: no player columns found, skipped.`)
      return
    }

    const dedupKey = gameDedupKey(block.tournament, block.date, block.gameNumber)
    if (dedupKey === null) {
      warnings.push(`${label}: couldn't read a "Game: #N" number for this block, so it can't be checked against games already imported — double-check it isn't a duplicate.`)
    } else if (seenKeys.has(dedupKey)) {
      warnings.push(`${label}: already imported (matches an existing game by tournament, date, and game number) — skipped.`)
      return
    } else {
      seenKeys.add(dedupKey)
    }

    // How much of each group matches the known roster?
    const ratios = groupLabels.map((g) => {
      const members = block.groups[g]
      const matched = members.filter((n) => rosterNames.has(n)).length
      return { label: g, ratio: members.length ? matched / members.length : 0, members }
    })

    // A scrimmage: every squad is entirely your own roster (vs. a real game,
    // where only one squad matches and the other is an external opponent).
    // Scrimmages count as real games by default — pass --skip-scrimmages to
    // exclude them instead.
    const isScrimmage = groupLabels.length > 1 && ratios.every((r) => r.ratio === 1)
    const best = ratios.slice().sort((a, b) => b.ratio - a.ratio)[0]

    if (isScrimmage && skipScrimmages) {
      warnings.push(`${label}: looks like an intrasquad scrimmage — skipped because --skip-scrimmages was passed.`)
      return
    }

    if (!isScrimmage && best.ratio === 0) {
      warnings.push(`${label}: none of the player names matched your roster in players.js — skipped. Check spelling, or add new players to the roster first.`)
      return
    }

    // In a scrimmage every squad counts as "us", since every player belongs
    // to your roster — their stats all count, and each player's "opponent"
    // for that game is whichever squad they personally weren't on. In a
    // real game, only the best-matching squad counts as "us".
    const usGroups = isScrimmage ? groupLabels : [best.label]

    if (isScrimmage && groupLabels.length > 2) {
      warnings.push(`${label}: more than two squads found — only the first two ("${groupLabels[0]}" vs "${groupLabels[1]}") are used for the game result. All players' stats were still merged.`)
    }

    usGroups.forEach((groupLabel) => {
      const unmatched = block.groups[groupLabel].filter((n) => !rosterNames.has(n))
      unmatched.forEach((n) => warnings.push(`${label}: "${n}" (team ${groupLabel}) isn't in players.js — their stats from this game were skipped. Add them to the roster first if they're a real player.`))
    })

    // Per-player stat rows → singleGameLog entries + player deltas. Each
    // player's "opponent" is the other squad relative to THEM, which matters
    // for a scrimmage where both squads are being merged at once.
    function otherGroupFor(groupLabel) {
      return groupLabels.find((g) => g !== groupLabel) || 'Unknown'
    }

    usGroups.forEach((groupLabel) => {
      block.groups[groupLabel].forEach((playerName) => {
        if (!rosterNames.has(playerName)) return
        const stats = block.players[playerName] || {}
        const row = {
          player: playerName,
          team: groupLabel,
          opponent: otherGroupFor(groupLabel),
          date: block.date,
          tournament: block.tournament,
          sourceGameNumber: block.gameNumber,
        }

        ;['goals', 'assists', 'throwAttempts', 'throwaways', 'completionPct', 'hucksAttempted', 'hucksCaught', 'huckPct', 'plusMinus', 'blocks', 'callahans'].forEach((f) => {
          if (stats[f] !== undefined) row[f] = stats[f]
        })
        singleGameRows.push(row)

        ACCUMULATING_FIELDS.forEach((f) => {
          if (stats[f] !== undefined) addDelta(playerName, f, Number(stats[f]))
        })
      })
    })

    // Build the games.js entry. For a real game, "us" is the best-matching
    // squad and the opponent is the other squad. For a scrimmage, there's no
    // real opponent — we just anchor the result on the first squad found,
    // with the second squad standing in as "opponent" for display purposes
    // (it'll show up as "vs. Blue", etc., same as any other game).
    const primaryLabel = isScrimmage ? groupLabels[0] : best.label
    const opponent = isScrimmage ? groupLabels[1] : groupLabels.find((g) => g !== best.label)
    const primaryScore = Number(block.teamScores[primaryLabel])
    const opponentScore = opponent !== undefined ? Number(block.teamScores[opponent]) : undefined

    if (opponent === undefined || Number.isNaN(primaryScore) || Number.isNaN(opponentScore)) {
      warnings.push(`${label}: couldn't find both teams' final scores in the "Team Stats" section — no games.js entry was created. You'll need to add it by hand.`)
    } else {
      const result = primaryScore > opponentScore ? 'W' : primaryScore < opponentScore ? 'L' : 'T'
      const leaders = usGroups
        .flatMap((g) => block.groups[g])
        .map((n) => ({ name: n, ...block.players[n] }))
        .filter((p) => rosterNames.has(p.name))
        .sort((a, b) => ((b.goals || 0) + (b.assists || 0)) - ((a.goals || 0) + (a.assists || 0)))
        .slice(0, 3)
        .map((p) => ({ name: p.name, goals: p.goals || 0, assists: p.assists || 0, blocks: p.blocks || 0 }))

      gameEntries.push({
        date: block.date,
        opponent,
        result,
        score: `${primaryScore}-${opponentScore}`,
        tournament: block.tournament,
        sourceGameNumber: block.gameNumber, // used to detect re-imports of this same game later; not shown anywhere on the site
        leaders,
      })
    }

    if (block.tournament && !tournamentNamesSeen.has(block.tournament)) {
      tournamentNamesSeen.add(block.tournament)
      tournamentStubs.push({ name: block.tournament, date: block.date })
    }
  })

  return { singleGameRows, playerDeltas, gameEntries, tournamentStubs, warnings }
}

// ---------------------------------------------------------------
// STEP 4 — write the updates to the data files.
// ---------------------------------------------------------------
function jsValue(v) {
  if (typeof v === 'string') return `'${v.replace(/'/g, "\\'")}'`
  return String(v)
}

function nextId(existingIds, prefix) {
  const nums = existingIds
    .map((id) => Number(String(id).replace(prefix, '')))
    .filter((n) => !Number.isNaN(n))
  const next = (nums.length ? Math.max(...nums) : 0) + 1
  return `${prefix}${String(next).padStart(2, '0')}`
}

export function appendSingleGameLog(src, newRows) {
  if (!newRows.length) return src
  const fieldOrder = ['player', 'team', 'opponent', 'date', 'tournament', 'sourceGameNumber', 'goals', 'assists', 'throwAttempts',
    'throwaways', 'completionPct', 'hucksAttempted', 'hucksCaught', 'huckPct', 'plusMinus', 'blocks', 'callahans']
  const lines = newRows.map((r) => {
    const parts = fieldOrder.filter((k) => r[k] !== undefined).map((k) => `${k}: ${jsValue(r[k])}`)
    return `  { ${parts.join(', ')} },`
  })
  return src.replace(/\n\]\s*\n\s*export default singleGameLog/, `\n${lines.join('\n')}\n]\n\nexport default singleGameLog`)
}

export function appendGames(src, newEntries) {
  if (!newEntries.length) return src
  const idMatches = Array.from(src.matchAll(/id: '(g\d+)'/g)).map((m) => m[1])
  const blocks = newEntries.map((g) => {
    const id = nextId(idMatches.length ? idMatches : ['g00'], 'g')
    idMatches.push(id)
    const leaderLines = g.leaders.map((l) => `      { name: '${l.name}', goals: ${l.goals}, assists: ${l.assists}, blocks: ${l.blocks} },`).join('\n')
    return [
      '  {',
      `    id: '${id}',`,
      `    date: '${g.date}',`,
      `    opponent: '${g.opponent}',`,
      `    result: '${g.result}',`,
      `    score: '${g.score}',`,
      `    tournament: '${g.tournament}',`,
      g.sourceGameNumber !== null && g.sourceGameNumber !== undefined
        ? `    sourceGameNumber: ${g.sourceGameNumber}, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it`
        : null,
      '    leaders: [',
      leaderLines,
      '    ],',
      '  },',
    ].filter((line) => line !== null).join('\n')
  })
  return src.replace(/\n\]\s*\n\s*export default games/, `\n${blocks.join('\n')}\n]\n\nexport default games`)
}

export function upsertTournaments(src, newStubs) {
  if (!newStubs.length) return src
  const existingNames = Array.from(src.matchAll(/name: '([^']+)'/g)).map((m) => m[1])
  const idMatches = Array.from(src.matchAll(/id: '(t\d+)'/g)).map((m) => m[1])
  const toAdd = newStubs.filter((s) => !existingNames.includes(s.name))
  if (!toAdd.length) return src

  const blocks = toAdd.map((s) => {
    const id = nextId(idMatches.length ? idMatches : ['t00'], 't')
    idMatches.push(id)
    return [
      '  {',
      `    id: '${id}',`,
      `    name: '${s.name}',`,
      "    location: '', // TODO: fill in",
      `    date: '${s.date}', // TODO: adjust to the full date range if multi-day`,
      "    finish: '', // TODO: fill in",
      "    record: '', // TODO: fill in",
      "    notes: '', // TODO: fill in",
      '    topPerformers: [], // TODO: fill in',
      '  },',
    ].join('\n')
  })
  return src.replace(/\n\]\s*\n\s*export default tournaments/, `\n${blocks.join('\n')}\n]\n\nexport default tournaments`)
}

export function mergePlayerStats(src, playerDeltas, roster) {
  let result = src
  for (const [name, delta] of playerDeltas.entries()) {
    const meta = roster.find((p) => p.name === name)
    if (!meta) continue
    const idMarker = `id: '${meta.id}',`
    const startIdx = result.indexOf(idMarker)
    if (startIdx === -1) continue

    const blockStart = result.lastIndexOf('\n  {', startIdx)
    const nextBlockStart = result.indexOf("\n  {\n    id:", startIdx + idMarker.length)
    const blockEnd = nextBlockStart === -1 ? result.indexOf('\n]', startIdx) : nextBlockStart

    let block = result.slice(blockStart, blockEnd)
    for (const [field, amount] of Object.entries(delta)) {
      if (!amount) continue
      const re = new RegExp(`(stats: \\{[\\s\\S]*?\\b${field}:\\s*)(-?\\d+(?:\\.\\d+)?)`)
      block = block.replace(re, (_, pre, num) => `${pre}${Number(num) + amount}`)
    }
    result = result.slice(0, blockStart) + block + result.slice(blockEnd)
  }
  return result
}

function loadRoster() {
  const src = fs.readFileSync(PLAYERS_PATH, 'utf8')
  const ids = Array.from(src.matchAll(/id: '(p\d+)',\s*\n\s*name: '([^']+)'/g))
  return ids.map(([, id, name]) => ({ id, name }))
}

// Reads games.js and builds the set of dedup keys for games that already
// have a recorded sourceGameNumber (i.e. games this script previously
// imported). Games added by hand won't have that field, so they're simply
// not part of this set — they can't collide with anything the script adds.
function loadExistingGameKeys() {
  const src = fs.readFileSync(GAMES_PATH, 'utf8')
  const starts = Array.from(src.matchAll(/\n {2}\{\n {4}id: 'g\d+',/g)).map((m) => m.index)
  const keys = new Set()

  starts.forEach((start, i) => {
    const end = i + 1 < starts.length ? starts[i + 1] : (src.indexOf('\n]', start) === -1 ? src.length : src.indexOf('\n]', start))
    const block = src.slice(start, end)
    const tournament = block.match(/tournament: '([^']*)'/)
    const date = block.match(/date: '([^']*)'/)
    const gameNum = block.match(/sourceGameNumber: (\d+)/)
    if (tournament && date && gameNum) {
      keys.add(gameDedupKey(tournament[1], date[1], Number(gameNum[1])))
    }
  })

  return keys
}

// Resolves a CLI path to a list of .xlsx files: the file itself if it's a
// file, or every .xlsx file directly inside it if it's a folder.
function resolveXlsxFiles(inputPath) {
  const resolved = path.resolve(inputPath)
  const stat = fs.statSync(resolved)

  if (stat.isFile()) return [resolved]

  if (stat.isDirectory()) {
    return fs.readdirSync(resolved)
      .filter((name) => name.toLowerCase().endsWith('.xlsx') && !name.startsWith('~$')) // ignore Excel's temp lock files
      .sort()
      .map((name) => path.join(resolved, name))
  }

  throw new Error(`${inputPath} is neither a file nor a folder.`)
}

// ---------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------
async function main() {
  console.log('Lime City Ultimate — tournament importer starting...\n')

  const args = process.argv.slice(2)
  const inputPath = args.find((a) => !a.startsWith('--'))
  const dryRun = args.includes('--dry-run')
  const skipScrimmages = args.includes('--skip-scrimmages')

  if (!inputPath) {
    console.error('Usage: node scripts/import-tournament.mjs path/to/Tournament.xlsx [--dry-run] [--skip-scrimmages]')
    console.error('       node scripts/import-tournament.mjs path/to/folder/ [--dry-run] [--skip-scrimmages]')
    process.exit(1)
  }

  const roster = loadRoster()
  const files = resolveXlsxFiles(inputPath)

  if (!files.length) {
    console.error(`No .xlsx files found at ${inputPath}.`)
    process.exit(1)
  }

  console.log(files.length > 1
    ? `Found ${files.length} spreadsheet(s):\n${files.map((f) => '  - ' + path.basename(f)).join('\n')}\n`
    : `Reading ${path.basename(files[0])}...`)

  const gameBlocks = files.flatMap((f) => {
    const blocks = parseWorkbook(f)
    console.log(`  ${path.basename(f)}: found ${blocks.length} game block(s)`)
    return blocks
  })

  const existingGameKeys = loadExistingGameKeys()
  const { singleGameRows, playerDeltas, gameEntries, tournamentStubs, warnings } =
    computeUpdates(gameBlocks, { roster, skipScrimmages, existingGameKeys })

  console.log(`\n${gameEntries.length} game(s) will be added to games.js.`)
  console.log(`${tournamentStubs.length} new tournament(s) will be added to tournaments.js (skeleton only — fill in details by hand).`)
  console.log(`${singleGameRows.length} player-game row(s) will be added to singleGameLog.js.`)
  console.log(`${playerDeltas.size} player(s) will have their season totals updated.`)

  if (warnings.length) {
    console.log('\nWarnings:')
    warnings.forEach((w) => console.log('  - ' + w))
  }

  if (dryRun) {
    console.log('\n--dry-run passed, no files were changed.')
    return
  }

  if (singleGameRows.length) {
    fs.writeFileSync(SINGLE_GAME_LOG_PATH, appendSingleGameLog(fs.readFileSync(SINGLE_GAME_LOG_PATH, 'utf8'), singleGameRows))
  }
  if (gameEntries.length) {
    fs.writeFileSync(GAMES_PATH, appendGames(fs.readFileSync(GAMES_PATH, 'utf8'), gameEntries))
  }
  if (tournamentStubs.length) {
    fs.writeFileSync(TOURNAMENTS_PATH, upsertTournaments(fs.readFileSync(TOURNAMENTS_PATH, 'utf8'), tournamentStubs))
  }
  if (playerDeltas.size) {
    fs.writeFileSync(PLAYERS_PATH, mergePlayerStats(fs.readFileSync(PLAYERS_PATH, 'utf8'), playerDeltas, roster))
  }

  console.log('\nDone. Review the diffs (especially tournaments.js — the TODOs need filling in) before committing.')
}

// pathToFileURL correctly handles Windows paths (C:\...) as well as
// Mac/Linux ones — building this URL by hand with a plain string template
// breaks on Windows, which is why this is done properly here.
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isMain) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
} else if (process.argv[1] && path.basename(process.argv[1]) === path.basename(fileURLToPath(import.meta.url))) {
  // This only fires if you genuinely ran `node .../import-tournament.mjs`
  // directly and the isMain check still failed to recognize it — which
  // would mean there's still a bug in that check. (Importing functions
  // from this file elsewhere, like the test files do, is normal and
  // intentionally does NOT trigger this.)
  console.error('import-tournament.mjs was run directly but did not start — this means the isMain check above still has a bug. Please report this.')
}
