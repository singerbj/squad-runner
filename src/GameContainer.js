import React, { useContext } from "react";
import Config from './Config';
import { PlayersConnect } from './gameScreens/PlayersConnect';
import { Context } from './GameState';

const GameContainer = () => {
    const { gameState, dispatch } = useContext(Context);

    if (gameState.phase === Config.GAME_STATE.PLAYERS_CONNECT) {
        return <PlayersConnect />;
    } else if (gameState.phase === Config.GAME_STATE.CHOOSE_ROLE) {
        // return <ChooseRole />;
    } else if (gameState.phase === Config.GAME_STATE.VOTE_JOURNEY) {

    } else if (gameState.phase === Config.GAME_STATE.ON_JOURNEY) {

    } else if (gameState.phase === Config.GAME_STATE.STATS_REVIEW) {

    } else if (gameState.phase === Config.GAME_STATE.VOTE_SPY) {

    } else if (gameState.phase === Config.GAME_STATE.JOURNEY_REVIEW) {

    } else if (gameState.phase === Config.GAME_STATE.GAME_REVIEW) {

    } else {
        return <div>ERROR</div>;
    }
}

export default GameContainer;
