(function (exports) {
  /*
  * Server to client: game is complete, the winner is ...
  */
  exports.T_GAME_WON_BY = "GAME-WON-BY";
  exports.O_GAME_WON_BY = {
    type: exports.T_GAME_WON_BY,
    data: null
  };

  /*
  * Server to client: abort game (e.g. if second player exited the game)
  */
  exports.T_GAME_ABORTED = "GAME-ABORTED";
  exports.O_GAME_ABORTED = {
    type: "GAME-ABORTED"
  };
  exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

  /*
  * Server to client: set player color
  */
  exports.T_PLAYER_TYPE = "PLAYER-TYPE";

  exports.O_PLAYER_BLUE = {
    type: exports.T_PLAYER_TYPE,
    data: "b"
  };
  exports.S_PLAYER_BLUE = JSON.stringify(exports.O_PLAYER_BLUE);

  exports.O_PLAYER_RED = {
    type: exports.T_PLAYER_TYPE,
    data: "r"
  };
  exports.S_PLAYER_RED = JSON.stringify(exports.O_PLAYER_RED);

  /*
  * Client to server: set nickname
  */
  exports.T_SET_NICKNAME = "SET-NICKNAME";
  exports.O_SET_NICKNAME = {
    type: exports.T_SET_NICKNAME,
    data: null
  };

  /*
  * Server to client: send opponent's nickname
  */
  exports.T_OPPONENT_NICKNAME = "OP-NICKNAME";
  exports.O_OPPONENT_NICKNAME = {
    type: exports.T_OPPONENT_NICKNAME,
    data: null
  };

  /*
  * Client to server: placed a hex
  */
  exports.T_PLACE_HEX = "PLACE-A-HEX";
  exports.O_PLACE_HEX = {
    type: exports.T_PLACE_HEX,
    data: null
  };

  /*
  * Server to client: opponent played
  */
  exports.T_OPPONENT_PLAYED = "OPPONENT-PLAYED";
  exports.O_OPPONENT_PLAYED = {
    type: exports.T_OPPONENT_PLAYED,
    data: null
  };

  /*
  * Server to client: sync local time with server time
  */
  exports.T_SYNC_TIMERS = "SYNC-TIMERS";
  exports.O_SYNC_TIMERS = {
    type: exports.T_SYNC_TIMERS,
    data: null
  };

})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
  //if exports is undefined, we are on the client; else the server