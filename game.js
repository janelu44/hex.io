// declare game object
let game = function (gameID) {
    this.playerRed = null;
    this.nicknameRed = '';
    this.playerBlue = null;
    this.nicknameBlue = '';

    // initialize timers to 5 minutes
    this.timeLeftRed = 300;
    this.timeLeftBlue = 300;

    this.id = gameID;
    this.toMove = 'blue';
    this.gameState = '0 JOINED';

    // initialize board
    this.board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
};

// define game state transitions
game.prototype.transitionStates = {};
game.prototype.transitionStates['0 JOINED'] = 0;
game.prototype.transitionStates['1 JOINED'] = 1;
game.prototype.transitionStates['2 JOINED'] = 2;
game.prototype.transitionStates['ONGOING'] = 3;
game.prototype.transitionStates['RED WIN'] = 4;
game.prototype.transitionStates['BLUE WIN'] = 5;
game.prototype.transitionStates['ABORTED'] = 6;

// define valid game state transitions
game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0], // 0 JOINED
    [1, 0, 1, 0, 0, 0, 0], // 1 JOINED
    [0, 0, 0, 1, 0, 0, 0], // 2 JOINED
    [0, 0, 0, 0, 1, 1, 1], // ONGOING
    [0, 0, 0, 0, 0, 0, 0], // RED WIN
    [0, 0, 0, 0, 0, 0, 0], // BLUE WIN
    [0, 0, 0, 0, 0, 0, 0]  // ABORTED WIN
];

// check if transition is valid
game.prototype.isValidTransition = function (from, to) {
    console.assert(
        typeof from == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof from
    );
    console.assert(
        typeof to == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof to
    );
    console.assert(
        from in game.prototype.transitionStates == true,
        "%s: Expecting %s to be a valid transition state",
        arguments.callee.name,
        from
    );
    console.assert(
        to in game.prototype.transitionStates == true,
        "%s: Expecting %s to be a valid transition state",
        arguments.callee.name,
        to
    );

    let i, j;
    if (!(from in game.prototype.transitionStates)) {
        return false;
    }
    else {
        i = game.prototype.transitionStates[from];
    }

    if (!(to in game.prototype.transitionStates)) {
        return false;
    }
    else {
        j = game.prototype.transitionStates[to];
    }

    return game.prototype.transitionMatrix[i][j] > 0;
};

// check if state is valid
game.prototype.isValidState = function (s) {
    return s in game.prototype.transitionStates;
};

// set game status
game.prototype.setStatus = function (w) {
    console.assert(
        typeof w == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof w
    );

    if (game.prototype.isValidState(w) && game.prototype.isValidTransition(this.gameState, w)) {
        this.gameState = w;
        console.log("[STATUS] %s", this.gameState);
    }
    else {
        return new Error(
            "Impossible status change from %s to %s",
            this.gameState,
            w
        );
    }
};

// check if 2 players are conected
game.prototype.hasTwoConnectedPlayers = function () {
    return this.gameState == "2 JOINED";
};

// check if game is ongoing
game.prototype.isOngoing = function () {
    return this.gameState == "ONGOING";
}

// add player to game
game.prototype.addPlayer = function (p) {
    console.assert(
        p instanceof Object,
        "%s: Expecting an object (WebSocket), got a %s",
        arguments.callee.name,
        typeof p
    );

    if (this.gameState != "0 JOINED" && this.gameState != "1 JOINED") {
        return new Error(
            "Invalid call to addPlayer, current state is " + this.gameState
        );
    }

    var error = this.setStatus("1 JOINED");
    if (error instanceof Error) {
        this.setStatus("2 JOINED");
        this.countTime();
    }

    if (this.playerRed == null) {
        this.playerRed = p;
        return "red";
    } else {
        this.playerBlue = p;
        return "blue";
    }
};

// place a hex
game.prototype.placeHex = function (move) {


    let splitMove = move.split(':');

    let color = splitMove[0];
    let row = splitMove[1];
    let column = splitMove[2];

    if (color == 'r') {
        console.assert(
            this.toMove == 'red',
            "Invalid move: red to move"
        );

        this.board[row][column] = 1;

        this.toMove = 'blue';

        this.syncBoard(this.playerBlue);

        if (this.verifyWin(1)) {
            this.setStatus("RED WIN");
            this.sendGameOver(1);
        }


    }
    else if (color == 'b') {
        console.assert(
            this.toMove == 'blue',
            "Invalid move: blue to move"
        );

        this.board[row][column] = -1;

        this.toMove = 'red';
        this.syncBoard(this.playerRed);

        if (this.verifyWin(-1)) {
            this.setStatus("BLUE WIN");
            this.sendGameOver(-1);
        }

    }
    else {
        return new Error(
            "Invalid move: no color specified",
        );
    }

}

// send move to other user
game.prototype.syncBoard = function (socket) {

    console.log('socket: ' + socket.id);

    let message = {
        type: 'OPPONENT-PLAYED',
        data: this.board
    }
    socket.send(JSON.stringify(message));

};

// send game over to user
game.prototype.sendGameOver = function (token) {
    let msg = {
        type: 'GAME-WON-BY',
        data: token
    }
    this.playerRed.send(JSON.stringify(msg));
    this.playerBlue.send(JSON.stringify(msg));

    const statTracker = require('./statTracker');

    statTracker.onlineUsers -= 2;
    statTracker.completedGames++;
    statTracker.liveGames--;

}

// check if cell is valid
game.prototype.valid = function (x, y, token, visited) {
    if (x < 0 || x >= 11)
        return false;
    if (y < 0 || y >= 11)
        return false;
    if (visited[x][y] != 0)
        return false;
    if (this.board[x][y] != token)
        return false;
    return true;
}


// check if any player won
game.prototype.verifyWin = function (token) {
    let dx = [-1, -1, 0, 1, 1, 0];
    let dy = [0, 1, 1, 0, -1, -1];

    var visited = [];
    for (var i = 0; i < 11; ++i) {
        visited[i] = [];
        for (var j = 0; j < 11; ++j) {
            visited[i][j] = 0;
        }
    }

    var queue = [];

    if (token == -1) {
        for (let i = 0; i <= 10; ++i)
            if (this.valid(i, 0, token, visited)) {
                queue.push([i, 0]);
            }
    } else {
        for (let j = 0; j <= 10; ++j)
            if (this.valid(0, j, token, visited)) {
                queue.push([0, j]);
            }
    }
    while (queue.length > 0) {
        var node = queue.shift();
        let x = node[0];
        let y = node[1];
        for (var i = 0; i < 6; ++i) {
            let xx = x + dx[i];
            let yy = y + dy[i];
            if (this.valid(xx, yy, token, visited)) {
                visited[xx][yy] = visited[x][y] + 1;
                queue.push([xx, yy]);
            }
        }
    }

    if (token == -1) {
        for (let i = 0; i <= 10; ++i)
            if (visited[i][10] >= 10) {
                return true;
            }
    }
    else {
        for (let j = 0; j <= 10; ++j)
            if (visited[10][j] >= 10) {
                return true;
            }
    }
    return false;

}

// set nickname and send to opponent
game.prototype.setNickname = function (player, name) {
    if (player == this.playerRed) {
        this.nicknameRed = name;
    }
    else {
        this.nicknameBlue = name;
        let msg1 = {
            type: 'OP-NICKNAME',
            data: name
        }
        this.playerRed.send(JSON.stringify(msg1));

        let msg2 = {
            type: 'OP-NICKNAME',
            data: this.nicknameRed
        }
        this.playerBlue.send(JSON.stringify(msg2));

    }
}

// send current time to user
game.prototype.syncTimers = function () {
    let timers = {
        type: 'SYNC-TIMERS',
        data: this.timeLeftRed + '/' + this.timeLeftBlue
    }
    if (this.playerRed != null) {
        this.playerRed.send(JSON.stringify(timers));
    }
    if (this.playerBlue != null) {
        this.playerBlue.send(JSON.stringify(timers));
    }
}

// count seconds
game.prototype.countTime = function () {
    setInterval(() => {
        if (this.gameState != "RED WIN" && this.gameState != "BLUE WIN" && this.gameState != "ABORTED") {
            this.decrementTime();
        }
    }, 1000);
}

// decrement and check if time is up
game.prototype.decrementTime = function () {
    if (this.toMove == 'red') {
        this.timeLeftRed--;
        if (this.timeLeftRed <= 0) {
            this.setStatus("BLUE WIN");
            this.sendGameOver(-1);
        }
    }
    else {
        this.timeLeftBlue--;
        if (this.timeLeftBlue <= 0) {
            this.setStatus("RED WIN");
            this.sendGameOver(1);
        }
    }
    this.syncTimers();
}


module.exports = game;

