// import packages and modules
const express = require('express');
const http = require('http');
const messages = require('./public/javascripts/messages');
const websocket = require('ws');
const Game = require('./game');
const statTracker = require('./statTracker');

// get port
let port = process.argv[2];
let app = express();

app.use(express.static(__dirname + "/public"));

// set view engine to ejs
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// render splash
app.get("/", function (req, res) {
    res.render('splash', statTracker);
})

// send game page
app.get("/game", function (req, res) {
    res.sendFile("game.html", { root: "./public" })
})

// send credits page
app.get("/credits", function (req, res) {
    res.sendFile("credits.html", { root: "./public" })
})

// create server
const server = http.createServer(app);
const wss = new websocket.Server({ server });

// object to store games
let websockets = {};

// create a new game
let currentGame = new Game(statTracker.gamesInitialized++);
let connectionID = 0;

// when user connects
wss.on("connection", function (ws) {
    // increment online users count
    statTracker.onlineUsers++;

    // store socket
    let con = ws;
    con.id = connectionID++;

    // add player to current game
    let playerType = currentGame.addPlayer(con);

    // store current game
    websockets[con.id] = currentGame;

    // send role to user
    con.send(playerType == 'red' ? messages.S_PLAYER_RED : messages.S_PLAYER_BLUE);

    // if 2 players join a game, the game starts
    //  and a new game is created
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame.setStatus("ONGOING");
        statTracker.liveGames++;
        currentGame = new Game(statTracker.gamesInitialized++);
    }

    // message from user
    con.on("message", function incoming(message) {

        // parse message
        let oMsg = JSON.parse(message);

        // retrieve game object
        let gameObj = websockets[con.id];

        // user set nickname
        if (oMsg.type == messages.T_SET_NICKNAME) {
            gameObj.setNickname(con, oMsg.data);
        }

        // user placed a hex
        if (oMsg.type == messages.T_PLACE_HEX) {
            gameObj.placeHex(oMsg.data);
        }
    });

    // user disconnects
    con.on('close', function (code) {

        // if connection was aborted by user
        if (code == "1001") {

            // retrieve game object
            let gameObj = websockets[con.id];

            // if the game was ongoing
            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
                gameObj.setStatus("ABORTED");

                // update statistics
                statTracker.completedGames++;
                statTracker.liveGames--;
                statTracker.onlineUsers -= 2;

                // create message
                let msg = {
                    type: messages.T_GAME_ABORTED
                };

                // send message to other user
                if (con == gameObj.playerRed) {
                    gameObj.playerBlue.send(JSON.stringify(msg));
                }
                else {
                    gameObj.playerRed.send(JSON.stringify(msg));
                }
            }
        }
    });
})

// set server port
server.listen(process.env.PORT || port);