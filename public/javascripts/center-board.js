// function to center board on screen
function centerBoard() {

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    console.log('window w: ' + windowWidth + ' h: ' + windowHeight);

    let boardWidth = 898;
    let boardHeight = 560;

    let marginH = (windowWidth - boardWidth) / 2;
    let marginV = (windowHeight - boardHeight) / 2;

    console.log('marginH: ' + marginH + ' marginV: ' + marginV);


    document.querySelector('.board-container').style.margin = marginV + 'px ' + marginH + 'px';
}

// call funtion on page load
centerBoard();

// call function on every resize
window.addEventListener('resize', centerBoard);

