// hex onclick listener
let hexes = document.querySelectorAll('td');
for (let h of hexes) {
    h.addEventListener("click", function () {

        // allow move only if is player turn
        if (window.gameData.isPlayerTurn) {
            // play sound on hex placement
            let placeSound = new Audio('../sounds/move.mp3');
            placeSound.play();

            // get position of placed hex
            let line = this.id.charCodeAt(0) - 97;
            let col = parseInt(this.id.substr(1));

            // if there is no other hex on that position
            if (window.gameData.board[line][col] == 0) {

                // register move locally
                window.gameData.board[line][col] = window.gameData.playerToken;

                // update hex color
                this.childNodes[0].className = window.gameData.playerType + ' hex';
                this.childNodes[0].childNodes[0].className = window.gameData.playerType + ' hex';

                // send move to server
                sendMove(window.gameData.playerToken, line, col);

                // end turn
                window.gameData.togglePlayerTurn(false);
            }
        }
    });
}

// function to send move through socket
function sendMove(cp, line, col) {
    let color = (cp == 1) ? 'r' : 'b';
    let move = {
        type: 'PLACE-A-HEX',
        data: color + ':' + line + ':' + col
    };
    socket.send(JSON.stringify(move));
}
