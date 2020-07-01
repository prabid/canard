import React, { Component } from "react";
import Sound from "react-sound";
import "./WaitingRoom.css";

class WaitingRoom extends Component {
  render() {
    console.log("wr render")
    return (
      <div className="hostGame waitingRoom">
        <Sound
            url="elevator.mp3"
            playStatus={Sound.status.PLAYING}
            loop={true}
            volume={1}
          />
        <div className="roomNumber">
          <span>Host: {this.props.room.roomId}</span>
        </div>
        <div className="waitingRoomPlayers">
          {this.props.room.players.map((player, index) => {
            return (
              <div className="waitingRoomPlayer" key={index}>
                <span>{player.name}</span>
              </div>
            );
          })}
        </div>
        <div className="startGameBtn">
          <button onClick={() => this.props.playIntro()} className="btn">Start Game</button>
        </div>  
      </div>
    );
  }
};

export default WaitingRoom;
