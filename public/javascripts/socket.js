(function setupSocket() {

    // open a web socket
    window.socket = new WebSocket("ws://hex-io.herokuapp.com/");

    // when the socket opens, send nickname to server
    socket.onopen = function () {
        let msg = {
            type: "SET-NICKNAME",
            data: window.nickname
        }
        socket.send(JSON.stringify(msg));
    }

    // when a message is received
    socket.onmessage = function incoming(event) {
        // parse the message
        let msg = JSON.parse(event.data)

        // set player type
        if (msg.type == 'PLAYER-TYPE') {
            window.gameData = new GameData(window.nickname, (msg.data == 'r') ? 'red' : 'blue');
            console.log(window.gameData);
        }

        // set opponent nickname
        if (msg.type == 'OP-NICKNAME') {
            window.gameData.opponentJoined(msg.data);
        }

        // register opponent move
        if (msg.type == 'OPPONENT-PLAYED') {
            window.gameData.opponentPlayed(msg.data);
        }

        // alert win
        if (msg.type == 'GAME-WON-BY') {
            window.gameData.alertWin(msg.data);
        }

        // synchronize timers
        if (msg.type == 'SYNC-TIMERS') {
            window.gameData.syncTimers(msg.data);
        }

        // anounce user that opponent left
        if (msg.type == 'GAME-ABORTED') {
            window.gameData.abortGame();
        }
    };
})();
