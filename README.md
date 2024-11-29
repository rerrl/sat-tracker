## Sat Tracker

A simple app I made to track your bitcoin balance. There is no wallet functionality, this is just a tool to track your bitcoin buys and a place to see your total sats bought, average price per bitcoin, and total return of your porfolio in dollars, etc with all data stored locally on your machine.

I created this becuase logging all my buys in a spreadsheet was getting tedious.

The idea is to have a place to keep track of your bitcoin balance. I use this by just logging every time I buy. I plan to add a method to track every time bitcoin is lost (onchain/withdraw fees, etc) so that I can have a more accurate picture of my total sats.

### Features

- Log your bitcoin buys (date, amount paid, amount of bitcoin bought)
- See your total sats bought, average price per bitcoin, and total return of your porfolio in dollars
- Import your BTC/USD buys from a CSV file (Coinbase/Coinbase Pro supported)
- All data is stored locally on your machine in a hidden folder under `$HOME` called `sat-tracker`
- obfuscate portfolio value

![image](https://github.com/user-attachments/assets/a65523aa-9bed-4b36-8b43-ae09e771bdc5)

Planned features:

- [ ] add logging of bitcoin leaving your possession
- [ ] toggle between sats and BTC
- [ ] Sat Trader section to easily track Sat-denominated trades and track their performance against BTC
- [ ] import from other exchanges

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

## To Do

- component consilidation for the 2 tables and the form
- add deductions to metrics (update total sat holdings)
- make tables less ugly (fix width, etc.)
- consolidate api methods where we can (add entries, delete entries, etc)

## Some extra notes

To add a new "API" method between electron and the react UI:

[ ] Add method to Window.electron in `types.d.ts`
[ ] Add method name and return type to `EventPayloadMapping` in `types.d.ts`
[ ] Add method to contextBridge.exposeInMainWorld in `src/electron/preload.cts`
[ ] Add method handler in `src/electron/main.ts`
