// object to store real-time statistics
let statTracker = {
    gamesInitialized: 0,
    liveGames: 0 /* number of games initialized */,
    completedGames: 0 /* number of games aborted */,
    onlineUsers: 0 /* number of games successfully completed */
};
  
module.exports = statTracker;