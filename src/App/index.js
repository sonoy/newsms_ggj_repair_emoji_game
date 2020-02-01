import { Client } from "boardgame.io/react";
import game from "./Game/"
import board from './Board/'

const App = Client({ game, board, debug: false, numPlayers: 2 });

export default App;
