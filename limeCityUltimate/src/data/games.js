// Each game has box-score-style stat lines per player.
// Add a new object here and it will appear automatically on the Stats page.
const games = [
    {
    id: 'g01',
    date: '2025-07-09',
    opponent: 'Blue',
    result: 'W',
    score: '5-2',
    tournament: 'Summer Clash #1',
    sourceGameNumber: 1, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Harrison N.', goals: 2, assists: 2, blocks: 1 },
      { name: 'Micah P.', goals: 3, assists: 1, blocks: 2 },
      { name: 'Jake S.', goals: 0, assists: 2, blocks: 2 },
    ],
  },
  {
    id: 'g02',
    date: '2025-07-09',
    opponent: 'Blue',
    result: 'L',
    score: '4-5',
    tournament: 'Summer Clash #1',
    sourceGameNumber: 2, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Jake S.', goals: 3, assists: 1, blocks: 2 },
      { name: 'Tiler C.', goals: 0, assists: 4, blocks: 0 },
      { name: 'Micah P.', goals: 1, assists: 2, blocks: 1 },
    ],
  },
  {
    id: 'g03',
    date: '2025-07-09',
    opponent: 'Blue',
    result: 'L',
    score: '4-5',
    tournament: 'Summer Clash #1',
    sourceGameNumber: 3, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Harrison N.', goals: 1, assists: 3, blocks: 4 },
      { name: 'Tiler C.', goals: 0, assists: 4, blocks: 1 },
      { name: 'Keagan P.', goals: 3, assists: 1, blocks: 0 },
    ],
  },
  {
    id: 'g04',
    date: '2025-07-09',
    opponent: 'Blue',
    result: 'W',
    score: '5-4',
    tournament: 'Summer Clash #1',
    sourceGameNumber: 4, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Harrison N.', goals: 0, assists: 5, blocks: 1 },
      { name: 'Jake S.', goals: 4, assists: 0, blocks: 1 },
      { name: 'Tiler C.', goals: 0, assists: 3, blocks: 4 },
    ],
  },
  {
    id: 'g05',
    date: '2025-07-09',
    opponent: 'Blue',
    result: 'W',
    score: '5-4',
    tournament: 'Summer Clash #1',
    sourceGameNumber: 5, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Harrison N.', goals: 0, assists: 4, blocks: 1 },
      { name: 'Micah P.', goals: 3, assists: 1, blocks: 0 },
      { name: 'Keagan P.', goals: 2, assists: 1, blocks: 0 },
    ],
  },
  
  {
    id: 'g06',
    date: '2025-08-03',
    opponent: 'Dark',
    result: 'W',
    score: '5-3',
    tournament: 'Summer Clash #2',
    sourceGameNumber: 1, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Dom L.', goals: 2, assists: 2, blocks: 0 },
      { name: 'Micah P.', goals: 2, assists: 1, blocks: 0 },
      { name: 'Dane B.', goals: 2, assists: 1, blocks: 1 },
    ],
  },
  {
    id: 'g07',
    date: '2025-08-03',
    opponent: 'Dark',
    result: 'L',
    score: '1-5',
    tournament: 'Summer Clash #2',
    sourceGameNumber: 2, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Ian E.', goals: 2, assists: 2, blocks: 0 },
      { name: 'JT Y.', goals: 1, assists: 2, blocks: 0 },
      { name: 'Keagan P.', goals: 1, assists: 0, blocks: 0 },
    ],
  },
  {
    id: 'g08',
    date: '2025-08-03',
    opponent: 'Dark',
    result: 'W',
    score: '5-2',
    tournament: 'Summer Clash #2',
    sourceGameNumber: 3, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Harrison N.', goals: 1, assists: 2, blocks: 2 },
      { name: 'Tiler C.', goals: 1, assists: 2, blocks: 0 },
      { name: 'Micah P.', goals: 1, assists: 1, blocks: 0 },
    ],
  },
  {
    id: 'g09',
    date: '2025-08-03',
    opponent: 'Dark',
    result: 'L',
    score: '3-4',
    tournament: 'Summer Clash #2',
    sourceGameNumber: 4, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Dom L.', goals: 1, assists: 2, blocks: 0 },
      { name: 'Ian E.', goals: 1, assists: 2, blocks: 1 },
      { name: 'Tiler C.', goals: 1, assists: 1, blocks: 0 },
    ],
  },

  {
    id: 'g10',
    date: '2025-12-23',
    opponent: 'Ice',
    result: 'W',
    score: '5-4',
    tournament: 'Frisbee Clash #3',
    sourceGameNumber: 1, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Dane B.', goals: 3, assists: 1, blocks: 1 },
      { name: 'Graham B.', goals: 2, assists: 1, blocks: 0 },
      { name: 'Harrison N.', goals: 0, assists: 2, blocks: 3 },
    ],
  },
  {
    id: 'g11',
    date: '2025-12-23',
    opponent: 'Ice',
    result: 'W',
    score: '5-4',
    tournament: 'Frisbee Clash #3',
    sourceGameNumber: 2, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Harrison N.', goals: 1, assists: 3, blocks: 1.5 },
      { name: 'Micah P.', goals: 3, assists: 1, blocks: 1 },
      { name: 'Gregory M.', goals: 2, assists: 1, blocks: 2.5 },
    ],
  },
  {
    id: 'g12',
    date: '2025-12-23',
    opponent: 'Ice',
    result: 'W',
    score: '5-3',
    tournament: 'Frisbee Clash #3',
    sourceGameNumber: 3, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Harrison N.', goals: 1, assists: 3, blocks: 0 },
      { name: 'Dane B.', goals: 2, assists: 1, blocks: 0 },
      { name: 'Gregory M.', goals: 2, assists: 0, blocks: 2 },
    ],
  },
  {
    id: 'g13',
    date: '2025-12-23',
    opponent: 'Ice',
    result: 'W',
    score: '4-3',
    tournament: 'Frisbee Clash #3',
    sourceGameNumber: 4, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Dane B.', goals: 3, assists: 0, blocks: 0 },
      { name: 'Gregory M.', goals: 0, assists: 3, blocks: 0 },
      { name: 'Harrison N.', goals: 1, assists: 1, blocks: 0 },
    ],
  },

  {
    id: 'g14',
    date: '2025-12-30',
    opponent: 'Kobe',
    result: 'W',
    score: '7-5',
    tournament: 'Frisbee Clash #3.5',
    sourceGameNumber: 1, // which "Game: #N" this was in its source spreadsheet — used to avoid re-importing it
    leaders: [
      { name: 'Harrison N.', goals: 0, assists: 7, blocks: 1 },
      { name: 'Gavin B.', goals: 7, assists: 0, blocks: 1 },
      { name: 'Gregory M.', goals: 1, assists: 4, blocks: 3 },
    ],
  },
  
]

export default games
