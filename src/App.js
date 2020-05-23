import React from "react";
import { PeerJsManager } from "./PeerJsManager";
import GameContainer from "./GameContainer";
import { GameState, Context } from './GameState';

const appCss = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "24px",
    color: "#222",
    zIndex: 500,
    position: "absolute",
    top: "0px",
    left: "0px",
    width: "calc(100% - 40px)",
    height: "calc(100% - 40px)",
    padding: "20px"
};

const setupChromeCast = () => {
    if (window.navigator.userAgent.indexOf('CrKey') > -1) {
        const options = new window.cast.framework.CastReceiverOptions();
        options.disableIdleTimeout = true;

        const instance = window.cast.framework.CastReceiverContext.getInstance();
        instance.start(options);
    }
};
setupChromeCast();


const App = () => {
    return (
        <GameState>
            <PeerJsManager />
            <div className="App" style={appCss}>
                <GameContainer />
            </div>
        </GameState>
    );
}

export default App;
