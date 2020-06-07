const attachListeners = require('./attachListeners');

const canard = ({ app, port, isSecure = false }, gameReference) => {
  const server = require(isSecure ? 'https' : 'http').Server(app);
  const io = require('socket.io')(server, { origins: '*:*' });

  attachListeners(io, gameReference);

  server.listen(port, () => console.log(`Canard online on port ${port}!`));
};

module.exports = canard;
