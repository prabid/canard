class RoomManager {
  constructor (roomId, socketId, maxPlayers) {
    this.roomId = roomId;
    this.socketId = socketId;
    this.maxPlayers = maxPlayers;
    this.players = [];
    this.topics = [["roomtopic1", "roomprompt1", "roomanswer1"], ["roomtopic2", "roomprompt2", "roomanswer2"], ["roomtopic3", "roompropmt3", "roomanswer3"]];
    this.chosen_topic = [];
    this.correct_pts = 5;
    this.tricked_pts = 1;
  }

  getRoomId() {
    return this.roomId;
  }

  getHost() {
    return this.socketId;
  }

  getAnswer() {
    return this.chosen_topic[2]
  }

  getPlayers() {
    return this.players;
  }

  getTopics() {
    // TODO
    return this.topics.map(topic => topic[0]);
  }

  setTopic(topic) {
    this.chosen_topic = this.topics.filter(t => t[0] == topic)[0];
    return this.chosen_topic[1];
  }

  getBluffs() {
    this.players.forEach(p => {
      p.isReady = false;
    });
    return this.players.map(p => p.bluff).concat(this.chosen_topic[2]);
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
    console.log(this.chosen_topic)
    this.players.forEach(p => {
      if (p.guess === this.chosen_topic[2]) {
        this.addToPlayerScore(p.playerId, this.correct_pts);
      }
      else {
        const bluffers = this.players.filter(bluffer => bluffer.bluff === p.guess && p.playerId !== bluffer.playerId);
        bluffers.forEach(bluffer => {
          this.addToPlayerScore(bluffer.playerId, this.tricked_pts);
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
}

module.exports = RoomManager;
