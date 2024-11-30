## Sat Tracker

A simple app I made to track your bitcoin balance. There is no wallet functionality, this is just a tool to track your bitcoin buys and a place to see your total sats bought, average price per bitcoin, and total return of your porfolio in dollars. All data is stored locally on your machine.

I created this becuase logging all my buys in a spreadsheet was getting tedious.

How I use this app:

- Use Acquisitions tab to log every time I buy bitcoin
- Use Deductions tab to log bitcoin loss (exchange withdraw fees, onchain fees for consolidation, etc)
- Since the idea is to provide a general "at a glance" view of your bitcoin holdings, the Total Return is very simply all the USD you spent on bitcoin minus the current value of your bitcoin holdings. This is not a perfect metric, but it's a good way to see how you're doing. Your current bitcoin holdings is a function of your logged buys and deductions.

### Features

- Log your bitcoin buys (date, amount paid, amount of bitcoin bought)
- See your total sats bought, average price per bitcoin, and total return of your porfolio in dollars
- Import your BTC/USD buys from a CSV file (Coinbase/Coinbase Pro, River supported)
- All data is stored locally on your machine in a hidden folder under `$HOME` called `sat-tracker`
- obfuscate portfolio value

![image](https://github.com/user-attachments/assets/a65523aa-9bed-4b36-8b43-ae09e771bdc5)

Planned features:

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

- Add migrations for sqlite so as to not corrupt user dbs
- component consilidation for the 2 tables and the form
- make tables less ugly (fix width, etc.)
- consolidate api methods where we can (add entries, delete entries, etc)
- add loading spinner when importing csv

## Some extra notes

To add a new "API" method between electron and the react UI:

[ ] Add method to Window.electron in `types.d.ts`
[ ] Add method name and return type to `EventPayloadMapping` in `types.d.ts`
[ ] Add method to contextBridge.exposeInMainWorld in `src/electron/preload.cts`
[ ] Add method handler in `src/electron/main.ts` or have electron push updates by using `ipcMainHanle` or `ipcWebContentsSend` respectively
