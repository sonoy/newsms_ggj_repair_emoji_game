# 👨‍🔧 Repair Emoji🤢 Game 👩‍🔧

This project is a multiplayer card game (web game) to collect required parts to repair the emoji. The player need to repair most of emoji to become a winner. 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and powered by [boardgame.io](https://boardgame.io) framework.


## Game Rules

- All player need to repair the emoji according to the missing parts in "Need to Repair" area.
- Each player will draw 5 cards into their hand at the begining
- Each player will draw or play a card in each move
- There is "Part" cards and "Effect" cards in the deck
  - "Part" cards will be placed to repair zone, only missing part cards can be played 
  - "Wildcard Part" card can be present for any part
  - "Effect" card has its own effect after played, please read its description.
- If all missing parts are found in any player's repair zone, the emoji will be repaired. 
  - The player repaired the emoji can get the total count of emoji's original requipments for the score
  - Other players will get the total count of parts in their own repair zone for the score. 
- After all card are drawn from deck, the game will be over.
- The player who get highest score will be the winner. 

---

## Technology Part

### NodeJS Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the web client in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `yarn start:server`

Runs the game server in your local machine.<br />

The server process will NOT reload if you make edits.<br />
Please press `CTRL` + `C` to exit the server process and re-run to activate the changes.

### Learn More

#### [Create React App](https://facebook.github.io/create-react-app/docs/getting-started)

#### [React](https://reactjs.org/)

#### [boardgame.io](https://boardgame.io/documentation/)

#### [Material-UI](https://material-ui.com/getting-started/installation/)

#### [Material-UI Icons](https://material-ui.com/components/material-icons/)

#### [Blueprint](https://blueprintjs.com/docs/)
