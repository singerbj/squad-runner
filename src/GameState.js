import React, { createContext, useReducer } from 'react';
import Config from './Config';

const INITIAL_STATE = {
    phase: 0,
    hostId: undefined,
    players: {},
    timeRemaining: undefined,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_HOST_ID':
            return {
                ...state,
                hostId: action.hostId
            }
        case 'PLAYER_CONNECTED':
            var numberOfPlayers = Object.keys(state.players).length;
            if (numberOfPlayers < Config.MAX_PLAYERS) {
                var players = { ...state.players };
                players[action.deviceId] = {
                    deviceId: action.deviceId,
                    playerId: action.playerId,
                    playerName: action.playerName,
                    connected: true,
                    lastMessage: Date.now(),
                    isHost: false
                };

                if (numberOfPlayers === 0) {
                    players[action.deviceId].isHost = true;
                }

                return {
                    ...state,
                    players: {
                        ...players
                    }
                }
            } else {
                return {
                    ...state
                }
            }
        case 'CHECK_CONNECTIONS':
            var players = { ...state.players };

            Object.keys(players).forEach((deviceId) => {
                let player = players[deviceId];
                if (player.connected && player.lastMessage < (Date.now() - Config.MAX_HEARTBEAT_INTERVAL)) {
                    player.connected = false;
                    if (state.gameState === Config.GAME_STATE.PLAYERS_CONNECT) {
                        if (player.isHost) {
                            delete players[deviceId];
                            var nextHost = players[Object.keys(players)[0]];
                            if (nextHost) {
                                nextHost.isHost = true;
                            }
                        } else {
                            delete players[deviceId];
                        }
                    }
                }
            });

            return {
                ...state,
                players: {
                    ...players
                }
            }
        case 'HEARTBEAT':
            var players = { ...state.players };
            var player = players[action.deviceId];
            if (player) {
                player.lastMessage = Date.now();
                return {
                    ...state,
                    players: {
                        ...players
                    }
                }
            } else {
                return {
                    ...state
                };
            }
        case 'SET_TIME_REMAINING':
            return {
                ...state,
                timeRemaining: action.timeRemaining
            };
        case 'START_GAME':
            var players = { ...state.players };
            var player = players[action.deviceId];
            if (player.isHost) {
                return {
                    ...state,
                    gameState: Config.GAME_STATE.CHOOSE_ROLE
                };
            } else {
                return {
                    ...state
                };
            }
        // case 'ROLE_SELECT':
        //     var players = { ...state.players };
        //     var player = players[action.deviceId];
        //     var roleSelected = action.data.roleSelected;

        //     var roleAlreadySelected = Object.keys(players).filter((deviceId) => {
        //         return players[deviceId].role === roleSelected;
        //     }).length > 0;

        //     if (!roleAlreadySelected) {
        //         player.role = roleSelected;
        //         return {
        //             ...state,
        //             players: {
        //                 ...players
        //             }
        //         }
        //     } else {
        //         return {
        //             ...state
        //         };
        //     }
        // case 'ROLE_SELECT_TIME_EXPIRE':
        //     var players = { ...state.players };

        //assign roles to remaining players who did not select one

        default:
            return state
    }
}

export const Context = createContext(INITIAL_STATE);

export const GameState = ({ children }) => {
    const [gameState, dispatch] = useReducer(reducer, INITIAL_STATE);
    return (
        <Context.Provider value={{ gameState, dispatch }}>
            {children}
        </Context.Provider>
    );
}
