// Each game has box-score-style stat lines per player.
// Add a new object here and it will appear automatically on the Stats page.
const games = [
  {
    id: 'g01',
    date: '2026-03-14',
    opponent: 'Prairie Fire',
    result: 'W',
    score: '15-11',
    tournament: 'Spring Thaw Invite',
    leaders: [
      { name: 'Priya Natarajan', goals: 6, assists: 1, blocks: 2 },
      { name: 'Marcus Webb', goals: 1, assists: 7, blocks: 3 },
      { name: 'Naomi Osei', goals: 3, assists: 2, blocks: 5 },
    ],
  },
  {
    id: 'g02',
    date: '2026-03-15',
    opponent: 'Steel City Sky',
    result: 'W',
    score: '13-9',
    tournament: 'Spring Thaw Invite',
    leaders: [
      { name: 'Elena Cruz', goals: 5, assists: 0, blocks: 3 },
      { name: 'Jordan Ames', goals: 2, assists: 6, blocks: 1 },
      { name: 'Devon Ashby', goals: 3, assists: 3, blocks: 2 },
    ],
  },
  {
    id: 'g03',
    date: '2026-04-04',
    opponent: 'Hoosier Heat',
    result: 'L',
    score: '10-13',
    tournament: 'Sectionals',
    leaders: [
      { name: 'Priya Natarajan', goals: 4, assists: 1, blocks: 1 },
      { name: 'Theo Barrington', goals: 0, assists: 5, blocks: 2 },
      { name: 'Naomi Osei', goals: 2, assists: 1, blocks: 4 },
    ],
  },
  {
    id: 'g04',
    date: '2026-04-05',
    opponent: 'Riverbend Rift',
    result: 'W',
    score: '15-8',
    tournament: 'Sectionals',
    leaders: [
      { name: 'Elena Cruz', goals: 6, assists: 2, blocks: 2 },
      { name: 'Marcus Webb', goals: 2, assists: 8, blocks: 1 },
      { name: 'Sofia Lindqvist', goals: 4, assists: 0, blocks: 3 },
    ],
  },
  {
    id: 'g05',
    date: '2026-05-02',
    opponent: 'Prairie Fire',
    result: 'W',
    score: '15-13',
    tournament: 'Regionals',
    leaders: [
      { name: 'Jordan Ames', goals: 3, assists: 5, blocks: 2 },
      { name: 'Priya Natarajan', goals: 7, assists: 0, blocks: 1 },
      { name: 'Naomi Osei', goals: 1, assists: 2, blocks: 6 },
    ],
  },
]

export default games
