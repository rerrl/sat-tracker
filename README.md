## Sat Tracker

A simple app I made to track some bitcoin portfolio metrics. I found it useful and thought I'd share.

All data is stored locally on your machine.

NOTE: As this project currently stands, it does not track sales of bitcoin. This tool is for sat stackers. The goal is to acquire more sats, not sell them.

### Features

- Log your bitcoin buys (date, amount paid, amount of bitcoin bought)
- See your total sats bought, average price per bitcoin, and total return of your porfolio in dollars
- Import your BTC/USD buys from a CSV file (Coinbase/Coinbase Pro supported)
- All data is stored locally on your machine in a hidden folder under `$HOME` called `sat-tracker`

Planned features:
[] toggle between sats and BTC
[] obfuscate portfolio value
[] Sat Trader section to easily track Sat-denominated trades and track their performance against BTC
[] import from other exchanges

## Contribute

PRs welcome!

To get this running locally in development mode:

```
git clone git@github.com:rerrl/sat-tracker.git
npm i
npm run dev
```

All data is stored in under your home folder in a hidden folder called `sat-tracker`.

`~/.sat-tracker`

To build the app for production:

```
# windows
npm run dist:win

# mac
npm run dist:mac

# linux
npm run dist:linux

```
