const io = require('socket.io-client');

const canardClient = async url => {
  const socket = await io.connect(url);

  /**
   * Room methods
   */

  const createRoom = () => {
    return new Promise(resolve => {
      socket.emit('cn-createRoom');
      socket.on('cn-roomData', data => {
        resolve(data);
      });
    });
  };

  const triggerTopics = (data) => {
    socket.emit('cn-triggerTopics', data);
  };

  const triggerResponses = (responses) => {
    socket.emit('cn-triggerResponses', responses);
  };

  const triggerScores = (data) => {
    socket.emit('cn-triggerScores', data);
  };

  const onPlayerJoin = cb => {
    socket.on('cn-onPlayerJoin', room => {
      cb(room);
    });
  };

  const onScores = cb => {
    socket.on('cn-onScores', scores => {
      cb(scores);
    });
  };

  const onBluffs = cb => {
    socket.on('cn-onBluffs', response => {
      cb(response);
    });
  };

  const onTopics = cb => {
    socket.on('cn-onTopics', topics => {
      cb(topics);
    });
  };

  const onPrompt = cb => {
    socket.on('cn-onPrompt', prompt => {
      cb(prompt);
    });
  };

  const onGuesses = cb => {
    socket.on('cn-onGuesses', guesses => {
      cb(guesses);
    });
  };

  const onEndGame = cb => {
    socket.on('cn-onEndGame', end => {
      cb(end);
    });
  };

  /**
   * Player methods
   */

  const joinRoom = (roomId, name) => {
    return new Promise(resolve => {
      socket.emit('cn-joinRoom', { roomId, name });
      socket.on('cn-roomConnectionSuccessful', playerId => {
        resolve(playerId);
      });
    });
  };

  const sendBluff = (data) => {
    socket.emit('cn-sendBluff', data)
  };

  const sendPrompt = (data) => {
    socket.emit('cn-sendPrompt', data)
  };

  const onResponses = cb => {
    socket.on('cn-onResponses', responses => {
      cb(responses);
    });
  };

  const onStatuses = cb => {
    socket.on('cn-onStatuses', statuses => {
      cb(statuses);
    });
  };

  const sendGuess = (data) => {
    socket.emit('cn-sendGuess', data)
  };

  const onError = cb => {
    socket.on('cn-error', error => {
      cb(error);
    });
  };

  return {
    createRoom,
    onPlayerJoin,
    joinRoom,
    triggerResponses,
    triggerTopics,
    triggerScores,
    onScores,
    onBluffs,
    onTopics,
    onPrompt,
    onGuesses,
    sendBluff,
    sendPrompt,
    onResponses,
    onStatuses,
    sendGuess,
    onError,
    onEndGame
  };
};

module.exports = canardClient;
