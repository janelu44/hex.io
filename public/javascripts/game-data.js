// object to store local data about current game
let GameData = function (nickname, playerType) {
    this.nickname = nickname;
    this.displayName = (playerType == 'red') ? document.querySelector('p.player-name#p2') : document.querySelector('p.player-name#p1');
    this.displayName.textContent = this.nickname;
    this.playerType = playerType;
    this.otherPlayer = (playerType == 'red') ? 'blue' : 'red';
    this.playerToken = (playerType == 'red') ? 1 : -1;
    this.isPlayerTurn = false;


    // initialize opponent
    this.hasOpponent = playerType != 'red';
    this.opponentName = '';
    this.opponentDisplayName = (playerType == 'red') ? document.querySelector('p.player-name#p1') : document.querySelector('p.player-name#p2');
    this.opponentDisplayName.textContent = this.hasOpponent ? this.opponentName : 'Searching...';
    if (!this.hasOpponent) {
        document.title = 'HEX. -----> Waiting for players...';
    }

    // assign move indicator objects
    this.playerMoveIndicator = (playerType == 'red') ? document.querySelector('p.player-moves#p2') : document.querySelector('p.player-moves#p1');
    this.playerMoveIndicator.style.visibility = 'hidden';
    this.opponentMoveIndicator = (playerType == 'red') ? document.querySelector('p.player-moves#p1') : document.querySelector('p.player-moves#p2');
    this.opponentMoveIndicator.style.visibility = 'hidden';

    // set intial time 5 minutes
    this.timeLeft = 300;
    this.opponentTimeLeft = 300;

    // assign timer objects
    this.playerTimer = document.querySelector((playerType == 'red') ? '#redTimer' : '#blueTimer');
    this.opponentTimer = document.querySelector((playerType == 'red') ? '#blueTimer' : '#redTimer');
    this.playerTimer.style.visibility = 'hidden';
    this.opponentTimer.style.visibility = 'hidden';

    // initialize local board
    this.board = [];
    for (var i = 0; i < 11; ++i) {
        this.board[i] = [];
        for (var j = 0; j < 11; ++j) {
            this.board[i][j] = 0;
        }
    }

}

// an opponent is found
GameData.prototype.opponentJoined = function (name) {
    this.isPlayerTurn = this.playerType != 'red';
    document.title = 'HEX. -----> ' + (this.isPlayerTurn ? 'YOUR TURN' : (name.toUpperCase() + '\'S TURN'));
    this.hasOpponent = true;
    this.opponentName = name;
    this.opponentDisplayName.textContent = name;
    this.playerMoveIndicator.style.visibility = (this.isPlayerTurn) ? 'visible' : 'hidden';
    this.opponentMoveIndicator.style.visibility = (this.isPlayerTurn) ? 'hidden' : 'visible';
    this.playerTimer.style.visibility = 'visible';
    this.opponentTimer.style.visibility = 'visible';
    if(this.playerType == 'red') {
        this.opponentTimer.style.color = 'yellow';
    }
    else {
        this.playerTimer.style.color = 'yellow';
    }

}

// change turn between players
GameData.prototype.togglePlayerTurn = function (toggle) {
    if (toggle) {
        this.isPlayerTurn = true;
        this.playerMoveIndicator.style.visibility = 'visible';
        this.opponentMoveIndicator.style.visibility = 'hidden';
        this.playerTimer.style.color = 'yellow';
        this.opponentTimer.style.color = 'white';
    }
    else {
        this.isPlayerTurn = false;
        this.playerMoveIndicator.style.visibility = 'hidden';
        this.opponentMoveIndicator.style.visibility = 'visible';
        this.playerTimer.style.color = 'white';
        this.opponentTimer.style.color = 'yellow';
    }

    document.title = 'HEX. -----> ' + (this.isPlayerTurn ? 'YOUR TURN' : (this.opponentName.toUpperCase() + '\'S TURN'));

}

// opponent played
GameData.prototype.opponentPlayed = function (data) {
    if (this.updateBoard(data)) {
        this.togglePlayerTurn(true);
    }
}

// update local board
GameData.prototype.updateBoard = function (data) {
    let dif = 0;
    let newX = 0;
    let newY = 0;
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            if (data[i][j] != this.board[i][j]) {
                dif++;
                newX = i;
                newY = j;
            }
        }
    }

    if (dif == 1) {
        this.board[newX][newY] = data[newX][newY];
        this.placeOpponentMove(newX, newY);
        return true;
    }
    else {
        return false;
    }
}

// display opponent's move on the board
GameData.prototype.placeOpponentMove = function (x, y) {
    let id = String.fromCharCode(x + 97) + y;
    let hex = document.querySelector('#' + id);
    hex.childNodes[0].className = this.otherPlayer + 'Hex';
    hex.childNodes[0].childNodes[0].className = this.otherPlayer + 'Hex';
}

// announce winner
GameData.prototype.alertWin = function (token) {
    this.isPlayerTurn = false;
    let a = document.querySelector('a.winner');
    if (token == this.playerToken) {
        a.innerHTML = this.nickname + ' wins! Click here to return to menu.';
    }
    else {
        a.innerHTML = this.opponentName + ' wins! Click here to return to menu.';
    }
    a.classList.add('grow');
    this.blink(token);

}

// make winner's hexes blink
GameData.prototype.blink = function (token) {
    if (token == -1)
        var cont = document.querySelectorAll('.blueHex');
    else
        var cont = document.querySelectorAll('.redHex');

    let target = [];
    for (let i = 0; i < cont.length; ++i) {
        if (i % 2 == 1)
            target.push(cont[i]);
    }
    var count = 0;
    var speed = 300;
    var id = setInterval(func, speed);
    function func() {
        if (count == 0) {
            for (t of target) {
                t.style.opacity = "0";
            }
            ++count;
        } else if (count == 1) {
            for (t of target) {
                t.style.opacity = "1";
            }
            count = 0;
        }
    }
}

// set timers according to server
GameData.prototype.syncTimers = function (time) {
    let r = time.split('/')[0];
    let b = time.split('/')[1];

    this.timeLeft = (this.playerType == 'red') ? r : b;
    this.opponentTimeLeft = (this.playerType == 'red') ? b : r;

    this.playerTimer.innerHTML = parseInt(this.timeLeft / 60) + ':' + ((this.timeLeft % 60 < 10) ? '0' : '') + (this.timeLeft % 60);
    this.opponentTimer.innerHTML = parseInt(this.opponentTimeLeft / 60) + ':' + ((this.opponentTimeLeft % 60 < 10) ? '0' : '') + (this.opponentTimeLeft % 60);

}

// let the user know when opponent left the game
GameData.prototype.abortGame = function () {
    this.isPlayerTurn = false;
    let a = document.querySelector('a.winner')
    a.innerHTML = this.opponentName + ' left the game. Click here to return to menu.';
    a.classList.add('grow');

}
