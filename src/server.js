const Server = require('boardgame.io/server').Server;
const Game = require('./App/Game/').default;
const server = Server({ games: [Game] });
server.run(8000);