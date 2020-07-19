const { PlayerManager, RoomListManager } = require('./objects');
const { generateId, shuffle } = require('./utils');
const db = require('./queries');

const roomListManager = new RoomListManager();
const NUM_ROUNDS = 3;

function attachListeners (io, gameReference) {
  io.on('connect', socket => {
    socket.on('cn-createRoom', () => {
      try {
        console.log('cn-createRoom');
        const id = generateId();
        socket.join(id);
        const room = roomListManager.addRoom(id, socket.id, 8);
        io.to(id).emit('cn-roomData', room);
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });

    socket.on('cn-joinRoom', ({ roomId, name }) => {
      try {
        console.log('cn-joinRoom');
        const room = roomListManager.getRoom(roomId);

        const newPlayerId = generateId();
        const socketId = socket.id;

        const newPlayer = {
          playerId: newPlayerId,
          roomId,
          socketId,
          name,
          isReady: false,
          score: 0
        };

        const player = room.addPlayer(newPlayer)
        if (player.playerId !== newPlayerId) {
          console.log('Already joined')
          io.to(socket.id).emit('cn-roomConnectionSuccessful', player.playerId)
          return;
        }

        io.to(room.getHost()).emit('cn-onPlayerJoin', room);
        io.to(socket.id).emit('cn-roomConnectionSuccessful', newPlayerId);
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });

    socket.on('cn-triggerTopics', async (data) => {
      try {
        console.log('cn-triggerTopics');
        const room = roomListManager.getRoomByHostSocketId(socket.id);
        console.log(room);

        room.incrementRoundNum();

        const questions = await db.getQuestions();

        const topics = room.setQuestions(questions);
        const randomPlayer = room.getRandomPlayer();

        io.to(randomPlayer.socketId).emit('cn-onTopics', topics);
        io.to(room.getHost()).emit('cn-onTopics', { "topics": topics, "topicPicker": randomPlayer.name });
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });

    socket.on('cn-chooseTopic', data => {
      try {
        console.log('cn-chooseTopic');
        const room = roomListManager.getRoomByPlayerSocketId(socket.id);

        const prompt = room.setTopic(data.topic);
        io.to(room.getHost()).emit('cn-onPrompt', [prompt[0], prompt[1]]);
        const players = room.getPlayers();

        players.forEach(player => {
          io.to(player.socketId).emit(
            'cn-onPrompt',
            prompt[1]
          );
        });
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });

    socket.on('cn-sendBluff', data => {
      try {
        console.log('cn-sendBluff');
        const room = roomListManager.getRoomByPlayerSocketId(socket.id);
        if (room.getAnswer().toUpperCase() === data.bluff.toUpperCase()) {
          io.to(socket.id).emit('cn-acceptable', false);
          return;
        }
        else {
          io.to(socket.id).emit('cn-acceptable', true);
        }


        room.setPlayerBluff(data.playerId, data.bluff);
        io.to(room.getHost()).emit('cn-onStatuses', room.getStatuses());

        if (room.allReady()) {
          io.to(room.getHost()).emit('cn-onBluffs', shuffle(room.getBluffsByPlayer()));
        }
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });

    socket.on('cn-triggerResponses', data => {
      try {
        console.log('cn-triggerResponses');
        const room = roomListManager.getRoomByHostSocketId(socket.id);

        const players = room.getPlayers();
        players.forEach(player => {
          io.to(player.socketId).emit(
            'cn-onResponses',
            shuffle(room.getBluffsByPlayer(player.playerId))
          );
        });
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });

    socket.on('cn-sendGuess', data => {
      try {
        console.log('cn-sendGuess');
        const room = roomListManager.getRoomByPlayerSocketId(socket.id);

        room.setPlayerGuess(data.playerId, data.guess);
        io.to(room.getHost()).emit('cn-onStatuses', room.getStatuses());
        if (room.allReady()) {
          io.to(room.getHost()).emit('cn-onGuesses', { "bluffs": room.getBluffs(), "guesses": room.getGuesses(), "answer": room.getAnswer().toUpperCase() });
        }
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });

    socket.on('cn-triggerScores', data => {
      try {
        console.log('cn-triggerScores');
        const room = roomListManager.getRoomByHostSocketId(socket.id);
        const players = room.getPlayers();

        const scores = room.calculateScores();
        let isEnd = false;
        if (room.getRoundNum() === NUM_ROUNDS) {
          isEnd = true;
          roomListManager.removeRoom(room.getRoomId());
          players.forEach(player => {
            io.to(player.socketId).emit('cn-gameEnd');
          });
        }
        io.to(room.getHost()).emit('cn-onScores', { "scores": scores, "isEnd": isEnd });
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });

    socket.on('cn-leaveRoom', data => {});

    socket.on('cn-setGameType', data => {
      try {
        const players = roomListManager.getRoom(data.roomId).getPlayers();

        players.forEach(player => {
          io.to(player.socketId).emit(
            'cn-setGameType',
            gameReference[data.gameType]
          );
        });
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });

    socket.on('cn-startGame', data => {
      try {
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
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });

    socket.on('cn-getUpdatedData', data => {
      try {
        const room = roomListManager.getRoom(data.roomId);

        io.to(room.getHost()).emit('cn-update', room);
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });

    socket.on('cn-playerAction', data => {
      try {
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
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });

    socket.on('cn-playerStatusUpdate', data => {
      try {
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
      } catch (error) {
        io.to(socket.id).emit('cn-error', error);
        console.log(error);
      }
    });
  });

  io.on('cn-disconnect', socket => {});
}

module.exports = attachListeners;
