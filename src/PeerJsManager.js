import React, { useEffect, useContext } from "react";
import { Context } from './GameState';
import Config from './Config';

const makeid = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const PeerJsManager = () => {
    const { gameState, dispatch } = useContext(Context);

    useEffect(() => {
        var serverId = makeid(Config.HOST_ID_LENGTH);
        var peer = new window.Peer(serverId, { debug: 3 });
        var connectionsArray = [];

        peer.on('open', function (id) {
            if (peer.id === null) {
                console.log('Received null id from peer open');
            } else {
                dispatch({
                    type: 'SET_HOST_ID',
                    hostId: peer.id
                });
            }
        });

        peer.on('connection', function (conn) {
            const playerName = conn.metadata ? conn.metadata.playerName : undefined;
            const deviceId = conn.metadata ? conn.metadata.deviceId : undefined;
            let numberOfPlayers = Object.keys(gameState.players).length;
            if (playerName && deviceId) {
                let gameStarted = !gameState.phase === Config.GAME_STATE.PLAYERS_CONNECT;
                let morePlayersCanJoin = numberOfPlayers < Config.MAX_PLAYERS;
                let playerHasConnectedBefore = gameState.players[deviceId];
                if ((!gameStarted && morePlayersCanJoin) || (gameStarted && playerHasConnectedBefore)) {
                    console.log("Connected to: " + conn.peer + " with playerName: " + playerName);
                    connectionsArray.push(conn);
                    dispatch({
                        type: 'PLAYER_CONNECTED',
                        deviceId,
                        playerId: conn.peer,
                        playerName
                    });

                    conn.on('data', function (data) {
                        console.log('data recieved from ' + conn.peer + ':', data);
                        dispatch(JSON.parse(data));
                    });
                    conn.on('close', function (data) {
                        console.log('close (conn) ' + conn.peer + ':', data);
                    });
                    conn.on('error', function (data) {
                        console.log('error (conn) ' + conn.peer + ':', data);
                    });
                } else {
                    if (gameStarted) {
                        console.log("Game already started, closing connection.");
                        conn.send({ type: "GAME_STARTED" });
                        setTimeout(() => { conn.close(); }, 1000);
                    } else if (!gameStarted) {
                        console.log("Too many connected players, closing connection.");
                        conn.send({ type: "TOO_MANY_PLAYERS" });
                        setTimeout(() => { conn.close(); }, 1000);
                    }
                }
            } else {
                console.log("Invalid Game connection, closing connection.");
                conn.send({ type: "GAME_STARTED" });
                setTimeout(() => { conn.close(); }, 1000);
            }
        });

        peer.on('disconnected', function (conn) {
            console.log('Connection lost. Please reconnect', conn);
        });

        peer.on('close', function () {
            console.log('Connection destroyed');
        });

        peer.on('error', function (err) {
            console.log(err);
        });

        setInterval(() => {
            connectionsArray = connectionsArray.filter((conn) => {
                return conn && conn.send && conn.peerConnection && conn.peerConnection.iceConnectionState !== "disconnected";
            });
            connectionsArray.forEach((conn) => {
                if (conn && conn.send && conn.peerConnection && conn.peerConnection.iceConnectionState !== "disconnected") {
                    conn.send(gameState);
                }
            });
        }, Config.SEND_STATE_INTERVAL);

        setInterval(() => {
            dispatch({
                type: 'CHECK_CONNECTIONS'
            });
        }, Config.CHECK_CONNECTION_INTERVAL);

        console.log('PeerJs setup complete!');
    },[]);

    return <React.Fragment></React.Fragment>;
};
