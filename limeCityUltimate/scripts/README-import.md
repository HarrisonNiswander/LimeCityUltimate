# Importing a tournament from Excel

Once per tournament, you can run:

```bash
npm install          # only needed the first time, to get the "xlsx" package
npm run import-tournament -- path/to/Tournament.xlsx
```

Or point it at a whole folder of spreadsheets to process them all in one go (handy if you're keeping all your tournament files together, e.g. in `scripts/tournament-files/`):

```bash
npm run import-tournament -- scripts/tournament-files/
```

That processes every `.xlsx` file in the folder and writes all the updates together in a single run — no need to run the command once per file.

This reads the spreadsheet(s) and updates:
- `src/data/players.js` — adds each player's numbers from this tournament onto their career totals
- `src/data/singleGameLog.js` — adds one row per player per game (powers every single-game leaderboard)
- `src/data/games.js` — adds a new game for each real (non-scrimmage) game found
- `src/data/tournaments.js` — adds a bare-bones entry for a new tournament name (you still fill in location, finish, and notes by hand — those aren't in the spreadsheet)

It does **not** touch `src/data/statLeaders.js` — that file derives everything automatically from the two files above.

## Try it safely first

```bash
npm run import-tournament -- path/to/Tournament.xlsx --dry-run
```

This parses the file and prints exactly what it found and what it *would* change, without writing anything. Always worth running this first on a new file.

## Scrimmages

If every player on every squad in a game matches your roster in `players.js` (i.e. it's an intrasquad scrimmage, not a real opponent), the script still treats it as a real game by default: every player's stats are merged, and it gets its own entry in `games.js` — the other squad's name (e.g. "Blue") stands in as the "opponent," the same way an actual opponent would, so it shows up on the Stats page like any other game. All the games in one spreadsheet (e.g. five scrimmage games all under "Summer Clash #1") get grouped into a single entry in `tournaments.js`, exactly like a real tournament with multiple games.

If you'd rather exclude a scrimmage entirely (no stats merged, no game logged), pass:

```bash
npm run import-tournament -- path/to/Tournament.xlsx --skip-scrimmages
```

## What the spreadsheet needs to look like

This matches the template you've been using:

- One sheet per day is fine, or everything in one sheet — it doesn't matter, the script just looks for game blocks wherever they are.
- Each game is its own block starting with a cell that says exactly `Game:` in one column, with the **tournament name** in the next column over, a `Game: #N` cell further along the same row, and a `Date: MM-DD-YY` cell on that row too.
- Below that, a row labeled `Player Name` with each player's name across the columns, a `Team` row right underneath with that player's squad (for scrimmages) or their actual team name (for real games — e.g. "Lime City"), and then stat rows labeled exactly:
  `Goals`, `Assists` (or `Assits`), `Total Throw Attempts`, `Throwaways`, `Completion %`, `Hucks Attempted`, `Huck Caught`, `Huck %`, `Plus/Minus`, `Blocks`, `Callahans`, `Points Played`, `Games Played` — one column per player. `Completion %` and `Huck %` cells can be either a percent-formatted cell (showing e.g. "95%") or a plain number (95) — both are handled correctly and come out the same on the site.
- A "Team Stats" section off to the side with its own `Team` header row naming each squad, and a `Goals` row — that row is used as each squad's final score for the game (not the `Scores` row also in that section, which in this template means goals + assists and would be roughly double the real score). If you'd rather use a different row, that's one line to change in `scripts/import-tournament.mjs` (see the `goalsRow` line inside `parseSheetGrid`).

Player names must **exactly match** the `name` field in `players.js` (same spelling/capitalization) to be attributed. If the script can't match a name, it skips that player and tells you — either fix the spelling or add them to the roster first.

## If something looks off

Run with `--dry-run` and check the console output and warnings before trusting the real run. The script never deletes or overwrites existing games, tournaments, or players — it only adds new games/log rows and increments existing players' totals. If a tournament name already exists in `tournaments.js`, it's left alone rather than duplicated.

## Re-running the script on the same files

You can safely point the script at a whole folder even if some files in it were already imported before — it recognizes games it's already added (by tournament name + date + the spreadsheet's own "Game: #N" number) and skips them, so re-running never double-counts a player's stats or creates duplicate games. You'll see a warning listing exactly which games were skipped as already-imported.

This only works for games the script itself imported. A game you added to `games.js` by hand won't be recognized, so re-importing the same spreadsheet later could create a duplicate for it — if you ever hand-edit a game in, it's worth noting that so you don't accidentally re-import it later.

## Troubleshooting

- **"require is not defined" / the script won't run at all** — this was a bug in an earlier version of the script (it tried to load the `xlsx` package incorrectly). If you're on that version, grab the fixed `scripts/import-tournament.mjs` — it's a one-line fix.
- **"Could not load the xlsx package"** — run `npm install` in the project root (not inside `scripts/`), then try again.
- **Running via `npm run` and your path/flags get ignored** — you need the `--` separator: `npm run import-tournament -- path/to/file.xlsx --dry-run`. Without it, npm swallows everything after `import-tournament`. Calling the script directly with `node scripts/import-tournament.mjs path/to/file.xlsx` sidesteps this entirely if it's easier to remember.
- **"Cannot find module" pointing at a `src/data/...` file** — run the script from the project root (where `package.json` lives), not from inside `scripts/`.
