// play button onclick listener
document.querySelector('img.playButton').addEventListener('click', function () {

    // alert user if window size does not correspond
    if (window.innerHeight < 600 || window.innerWidth < 1300) {
        alert("You are not using the minimum recommended window size. Your current resolution is "
            + window.innerWidth
            + "x"
            + window.innerHeight
            + "\nPlease increase your window size or the game will not render properly");

    }
    else {
        // load game page
        document.location.href = '/game';
    }
});

// credits button onclick listener
document.querySelector('img.statsButton').addEventListener('click', function () {
    // load credits page
    document.location.href = '/credits';
});

// help button onclick listener
document.querySelector('img.helpButton').addEventListener('click', function () {
    // redirect user to game rules
    window.open('https://en.wikipedia.org/wiki/Hex_(board_game)#Game_play');
});
