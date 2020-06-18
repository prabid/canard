const io = require('socket.io-client');

const canardClient = async url => {
  const socket = await io.connect(url);

  /*
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

  const removeListener = (channel, fn) => {
    socket.off(channel, fn);
  }

  /*
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
    return new Promise(resolve => {
      socket.emit('cn-sendBluff', data);
      socket.on('cn-acceptable', acc => {
        resolve(acc);
      });
    });
  };

  const chooseTopic = (data) => {
    socket.emit('cn-chooseTopic', data)
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

  const gameEnd = cb => {
    socket.on('cn-gameEnd', () => {
      cb();
    })
  }

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
    chooseTopic,
    onResponses,
    onStatuses,
    sendGuess,
    gameEnd,
    onError,
    removeListener
  };
};

module.exports = canardClient;
