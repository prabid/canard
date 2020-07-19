import React, { Component } from "react";
import Sound from "react-sound";
import "./WaitingRoom.css";

class WaitingRoom extends Component {
  render() {
    console.log(this.props.room)
    return (
      <div className="hostGame waitingRoom">
        <Sound
            url="elevator.mp3"
            playStatus={Sound.status.PLAYING}
            loop={true}
            volume={1}
          />
        <div className="waitingRoomContainer">
          <div className="waitingRoomInfo">
            <div className="roomHeader">
              <span>YOUR ROOM CODE</span>
            </div>
            <div className="roomCode">
              <span>{this.props.room.roomId}</span>
            </div>
            <div className="startGameBtn">
              <button onClick={() => this.props.playIntro()} className="btn">Start Game</button>
            </div>
          </div>
        </div>
        <div className="waitingRoomContainer">
          <div className="waitingRoomPlayers">
            {this.props.room.players.map((player, index) => {
              return (
                <div className="waitingRoomPlayer" key={index}>
                  <span>{player === undefined ? '' : player.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
};

export default WaitingRoom;
