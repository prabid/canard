import React, { Component } from "react";
import Sound from "react-sound";
import "./WaitingRoom.css";

class WaitingRoom extends Component {
  render() {
    return (
      <div className="hostGame waitingRoom" >
        <Sound
            url="skype_ringtone.mp3"
            playStatus={true ? Sound.status.PAUSED : Sound.status.PLAYING}
            loop={true}
            autoLoad={true}
          />
        <div className="roomNumber">
          <span>Host: {this.props.room.roomId}</span>
        </div>
        <div className="startGameBtn">
          <button onClick={() => this.props.setStatus("topic")} className="btn">Start Game</button>
        </div>  
      </div>
    );
  }
};

export default WaitingRoom;
