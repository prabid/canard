const { onlyUnique } = require('../utils.js')

class RoomManager {
  constructor (roomId, socketId, maxPlayers) {
    this.roomId = roomId;
    this.socketId = socketId;
    this.maxPlayers = maxPlayers;
    this.players = [];
    this.questions = [];
    this.chosenQuestion = [];
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
    return this.chosenQuestion["answer"].toUpperCase();
  }

  getPlayers() {
    return this.players;
  }

  setQuestions(questions) {
    console.log("setQuestions");
    console.log(questions);
    this.questions = questions;
    return this.questions.map(q => q["topic"]);
  }

  getRoundNum() {
    return this.roundNum;
  }

  setTopic(topic) {
    this.chosenQuestion = this.questions.filter(q => q["topic"] == topic)[0];
    return [this.chosenQuestion["topic"], this.chosenQuestion["prompt"]];
  }

  getBluffsByPlayer(playerId) {
    const player = this.players.filter(p => p.playerId === playerId);
    let bluff = undefined;
    if (player.length > 0) {
      bluff = player[0].bluff.toUpperCase();
    }
    const players = this.players.filter(p => p.playerId !== playerId && p.bluff.toUpperCase() !== bluff);
    const bluffs = onlyUnique(players.map(p => p.bluff.toUpperCase()));
    return bluffs.concat(this.chosenQuestion["answer"].toUpperCase());
  }

  getBluffs() {
    return this.players.map(p => {
      return { "name": p.name, "bluff": p.bluff };
    });
  }

  getGuesses() {
    return this.players.map(p => {
      return { "name": p.name, "guess": p.guess };
    });
  }

  getStatuses() {
    return this.players.map(p => { 
      return { "name": p.name, "isReady": p.isReady };
    })
  }

  getRandomPlayer() {
    const player = this.players[Math.floor(Math.random() * this.players.length)];
    if (player === undefined) {
      throw 'No players';
    }
    return player;
  }

  setPlayerBluff(playerId, bluff) {
    console.log(playerId)
    console.log(this.players);
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
    this.players.forEach(p => {
      if (p.guess.toUpperCase() === this.chosenQuestion["answer"].toUpperCase()) {
        this.addToPlayerScore(p.playerId, this.correctPts);
      }
      else {
        const bluffers = this.players.filter(bluffer => bluffer.bluff.toUpperCase() === p.guess.toUpperCase() && p.playerId !== bluffer.playerId);
        bluffers.forEach(bluffer => {
          this.addToPlayerScore(bluffer.playerId, this.trickedPts);
        });
      }
    });
    return this.players;
  }

  addPlayer(player) {
    if (this.players.length >= this.maxPlayers) {
      throw 'Room is full';
    }

    this.players.push(player);
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
    const isAllReady = this.players.filter(p => p.isReady === false).length === 0;
    if (isAllReady) {
      this.players.forEach(p => {
        p.isReady = false;
      });
    }
    return isAllReady;
  }

  incrementRoundNum() {
    this.roundNum += 1;
    return this.roundNum;
  }
}

module.exports = RoomManager;
