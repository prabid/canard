const { PlayerManager, RoomListManager } = require('./objects');
const { generateId } = require('./utils');

const players = new PlayerManager();
const roomListManager = new RoomListManager();

function attachListeners (io, gameReference) {
  io.on('connect', socket => {
    socket.on('cn-createRoom', () => {
      const id = generateId();
      socket.join(id);
      const room = roomListManager.addRoom(id, socket.id, 8);
      io.to(id).emit('cn-roomData', room);
    });

    socket.on('cn-joinRoom', ({ roomId, name }) => {
      if (roomListManager.roomExists(roomId) === false) {
        io.to(socket.id).emit('cn-error', 'Room not found');
        return;
      }

      const room = roomListManager.getRoom(roomId);

      const playerId = generateId();
      const newPlayer = players.addPlayer(playerId, roomId, socket.id, name);

      if (!room.addPlayer(newPlayer)) {
        io.to(socket.id).emit('cn-error', 'Room is full');
        return;
      }

      io.to(room.getHost()).emit('cn-onPlayerJoin', room);
      io.to(socket.id).emit('cn-roomConnectionSuccessful', playerId);
    });

    socket.on('cn-topics', data => {
      console.log('cn-topics');
      const room = roomListManager.getRoomByHostSocketId(socket.id);
      if (room.getRoomId() !== data.roomId) {
        io.to(socket.id).emit('cn-error', 'Room by socketid not found');
        return;
      }
      const players = room.getPlayers();
      const topics = room.getTopics();
      io.to(players[0].socketId).emit('cn-onTopics', topics)
    });

    socket.on('cn-sendPrompt', data => {
      console.log('sendPrompt');
      const room = roomListManager.getRoomByPlayerSocketId(socket.id);
      if (room.getRoomId() !== data.roomId) {
        io.to(socket.id).emit('cn-error', 'Room by socketid not found');
        return;
      }

      const prompt = room.setTopic(data.prompt);
      io.to(room.getHost()).emit('cn-onPrompt', prompt[0]);
      const players = room.getPlayers();

      players.forEach(player => {
        io.to(player.socketId).emit(
          'cn-onPrompt',
          prompt[0]
        );
      });
    });

    socket.on('cn-sendBluff', data => {
      console.log('cn-sendBluff');
      const room = roomListManager.getRoomByPlayerSocketId(socket.id);
      if (room.getRoomId() !== data.roomId) {
        io.to(socket.id).emit('cn-error', 'Room by socketid not found');
        return;
      }
      room.setPlayerBluff(data.playerId, data.bluff);
      if (room.allReady()) {
        console.log('allready');
        io.to(room.getHost()).emit('cn-onBluffs', room.getBluffs());
      }
    });

    socket.on('cn-responses', data => {
      console.log('cn-responses');
      console.log(data.bluffs);
      const room = roomListManager.getRoomByHostSocketId(socket.id);
      if (room.getRoomId() !== data.roomId) {
        io.to(socket.id).emit('cn-error', 'Room by socketid not found');
        return;
      }
      const players = room.getPlayers();
      players.forEach(player => {
        io.to(player.socketId).emit(
          'cn-onResponses',
          data.bluffs
        );
      });
    });

    socket.on('cn-sendGuess', data => {
      console.log('cn-sendGuess');
      const room = roomListManager.getRoomByPlayerSocketId(socket.id);
      if (room.getRoomId() !== data.roomId) {
        io.to(socket.id).emit('cn-error', 'Room by socketid not found');
        return;
      }
      room.setPlayerGuess(data.playerId, data.guess);
      if (room.allReady()) {
        io.to(room.getHost()).emit('cn-onGuesses', room.getGuesses());
      }
    });

    socket.on('cn-scores', data => {
      const room = roomListManager.getRoomByHostSocketId(socket.id);
      if (room.getRoomId() !== data.roomId) {
        io.to(socket.id).emit('cn-error', 'Room by socketid not found');
        return;
      }
      const scores = room.calculateScores();
      console.log('cn-scores');
      console.log(scores)
      io.to(room.getHost()).emit('cn-onScores', scores);
    });

    socket.on('cn-leaveRoom', data => {});

    socket.on('cn-setGameType', data => {
      const players = roomListManager.getRoom(data.roomId).getPlayers();

      players.forEach(player => {
        io.to(player.socketId).emit(
          'cn-setGameType',
          gameReference[data.gameType]
        );
      });
    });

    socket.on('cn-startGame', data => {
      const players = roomListManager.getRoom(data.roomId).getPlayers();

      players.forEach(player => {
        io.to(player.socketId).emit('cn-gameStart', data.gameType);
      });

      setTimeout(() => {
        const players = roomListManager.getRoom(data.roomId).getPlayers();

        players.forEach(player => {
          io.to(player.socketId).emit('cn-gameOver');
        });
      }, gameReference[data.gameType].gameLength);
    });

    socket.on('cn-getUpdatedData', data => {
      const room = roomListManager.getRoom(data.roomId);

      io.to(room.getHost()).emit('cn-update', room);
    });

    socket.on('cn-playerAction', data => {
      const room = roomListManager.getRoom(data.roomId);

      switch (data.gameType) {
        case 'squatRace':
          if (data.actionType === 'squat') {
            room.addToPlayerScore(data.playerId, 1);
            io.to(room.getHost()).emit('cn-updateData', room);
          }
          break;
        default:
          break;
      }
    });

    socket.on('cn-playerStatusUpdate', data => {
      const room = roomListManager.getRoom(data.roomId);

      room.updatePlayerStatus(
        data.playerId,
        data.playerIsReady
      );

      if (room.allReady()) {
        io.to(room.getHost()).emit('cn-playersReady', true);
      } else {
        io.to(room.getHost()).emit('cn-playersReady', false);
      }

      io.to(room.getHost()).emit('cn-updateData', room);
    });
  });

  io.on('cn-disconnect', socket => {});
}

module.exports = attachListeners;
