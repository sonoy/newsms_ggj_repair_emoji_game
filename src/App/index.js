import React from "react";
//import { Client } from "boardgame.io/react";
import { Lobby } from "boardgame.io/react";
//import { Local } from 'boardgame.io/multiplayer';
//import { SocketIO } from "boardgame.io/multiplayer";
import { Typography, Divider, CssBaseline } from "@material-ui/core";
import game from "./Game/";
import board from "./Board/";
import "./App.css";

/*
const GameClient = Client({
	game,
	board,
	debug: false,
	numPlayers: 2,
	//multiplayer: Local()
	multiplayer: SocketIO({ server: "localhost:8000" })
});
*/

const server =
	process.env.REACT_APP_CONFIG_SERVER ||
	`${window.location.protocol}//${window.location.hostname}:8000`;

export default props => (
	<div>
		{/* 
    <GameClient playerID="0" />
      <hr />
    <GameClient playerID="1" /> 
    */}
		<CssBaseline />
		<Typography variant="subtitle2" align="center">
			<span role="img" aria-label="">
				🕹️
			</span>{" "}
			HKGGJ 2020 Game Project{" "}
      <span role="img" aria-label="">
				🕹️
			</span>
		</Typography>
		<Typography variant="h3" align="center" gutterBottom>
			<span role="img" aria-label="">
				👨‍🔧
			</span>{" "}
			Repair Emoji🤢 Game{" "}
			<span role="img" aria-label="">
				👩‍🔧
			</span>
		</Typography>
		<Divider />
		<Lobby
			gameServer={server}
			lobbyServer={server}
			gameComponents={[{ game, board }]}
		/>
	</div>
);
