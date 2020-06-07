const RoomManager = require('./roomManager');

class RoomListManager {
  constructor() {
    this.rooms = [];
  }

  getRoomByHostSocketId(socketId) {
    const room = this.rooms.filter(room => room.getHost() === socketId)[0];
    if (room == undefined) {
      throw 'Room by host socket id not found';
    }
    return room;
  }

  getRoomByPlayerSocketId(socketId) {
    const room = this.rooms.filter(room => 
      room.getPlayers().filter(player => player.socketId === socketId).length > 0)[0];
    if (room === undefined) {
      throw 'Room by player socket id not found';
    }
    return room;
  }

  addRoom(roomId, socketId, maxPlayers) {
    const room = new RoomManager(roomId, socketId, maxPlayers);
    this.rooms.push(room);
    return room;
  }

  removeRoom(id) {
    const removedRoom = this.rooms.filter(room => room.getRoomId() === id)[0];

    if (removedRoom) {
      this.room = this.rooms.filter(room => room.getRoomId() !== id);
    }

    return removedRoom;
  }

  getRoom(roomId) {
    const room = this.rooms.filter(room => room.getRoomId() === roomId)[0];
    if (room === undefined) {
      throw 'Room not found';
    }
    return room;
  }

  roomExists(id) {
    const found = this.rooms.filter(room => room.getRoomId() === id);

    if (found.length > 0) {
      return true;
    }

    return false;
  }
}

module.exports = RoomListManager;
