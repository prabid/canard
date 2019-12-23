class RoomManager {
  constructor (roomId, socketId, maxPlayers) {
    this.roomId = roomId;
    this.socketId = socketId;
    this.maxPlayers = maxPlayers;
    this.players = [];
    this.topics = [["roomtopic1", "roomprompt1", "roomanswer1"], ["roomtopic2", "roomprompt2", "roomanswer2"], ["roomtopic3", "roompropmt3", "roomanswer3"]];
    this.chosenTopic = [];
    this.correctPts = 5;
    this.trickedPts = 1;
    this.roundNum = 0;
  }

  getRoomId() {
    return this.roomId;
  }

  getHost() {
    return this.socketId;
  }

  getAnswer() {
    return this.chosenTopic[2]
  }

  getPlayers() {
    return this.players;
  }

  getTopics() {
    // TODO
    return this.topics.map(topic => topic[0]);
  }

  getRoundNum() {
    return this.roundNum;
  }

  setTopic(topic) {
    this.chosenTopic = this.topics.filter(t => t[0] == topic)[0];
    return this.chosenTopic[1];
  }

  getBluffs() {
    this.players.forEach(p => {
      p.isReady = false;
    });
    return this.players.map(p => p.bluff).concat(this.chosenTopic[2]);
  }

  getGuesses() {
    this.players.forEach(p => {
      p.isReady = false;
    });
    return this.players.map(p => {
      return { "guess": p.guess, "playerId": p.playerId };
    });
  }

  getStatuses() {
    return this.players.map(p => { 
      return {"name": p.name, "isReady": p.isReady };
    })
  }

  setPlayerBluff(playerId, bluff) {
    const player = this.players.filter(
      player => player.playerId === playerId
    )[0];
    player.bluff = bluff;
    player.isReady = true;
  }

  setPlayerGuess(playerId, guess) {
    const player = this.players.filter(
      player => player.playerId === playerId
    )[0];
    player.guess = guess;
    player.isReady = true;
  }

  calculateScores() {
    console.log("calculate-scores");
    console.log(this.players);
    console.log(this.chosenTopic)
    this.players.forEach(p => {
      if (p.guess === this.chosenTopic[2]) {
        this.addToPlayerScore(p.playerId, this.correctPts);
      }
      else {
        const bluffers = this.players.filter(bluffer => bluffer.bluff === p.guess && p.playerId !== bluffer.playerId);
        bluffers.forEach(bluffer => {
          this.addToPlayerScore(bluffer.playerId, this.trickedPts);
        });
      }
    });
    return this.players;
  }

  addPlayer(player) {
    if (this.players.length >= this.maxPlayers) {
      return false;
    }

    this.players.push(player);
    return true;
  }

  removePlayer(playerId) {
    this.players.filter(p => p.playerId !== playerId);
  }

  updatePlayerStatus(playerId, playerIsReady) {
    const player = this.players.filter(
      player => player.playerId === playerId
    )[0];

    if (player == null) {
      return false;
    }

    player.isReady = playerIsReady;
  }

  addToPlayerScore(playerId, amount) {
    const player = this.players.filter(
      p => p.playerId === playerId
    )[0];

    if (player == null) {
      return false;
    }

    player.score += amount;
  }

  allReady() {
    const notReady = this.players.filter(p => p.isReady === false);
    return notReady.length === 0;
  }

  incrementRoundNum() {
    this.roundNum += 1;
    return this.roundNum;
  }
}

module.exports = RoomManager;
