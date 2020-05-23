import React, { useContext } from "react";
import Config from '../Config';
import { Context } from '../GameState';

export const PlayersConnect = () => {
	const { gameState, dispatch } = useContext(Context);

	let numberOfPlayers = Object.keys(gameState.players).length;
	let players = Object.keys(gameState.players).map((hardwareId) => { return gameState.players[hardwareId]; });
	let hostPlayer = players.filter((player) => { return player.isHost; })[0];
	let playerJsx = players.map((player, i) => {
		return (
			<div key={i}>
				Player {i + 1}: {player.playerName}
			</div>
		);
	});

	for (let i = numberOfPlayers; i < Config.MAX_PLAYERS; i += 1) {
		playerJsx.push(
			<div key={i}>
				Player {i + 1}: ?
  			</div>
		);
	}

	return (
		<div>
			<h3>Spaceship Identifier: {gameState.hostId ? gameState.hostId.split('').join(' ') : "Loading..."}</h3>
			<div>
				<div>Number of Players Connected: {numberOfPlayers} out of {Config.MAX_PLAYERS}</div>
				{playerJsx}
			</div>
			{hostPlayer &&
				<h3>Start your engines when ready, {hostPlayer.playerName}!</h3>
			}
		</div>
	);
}