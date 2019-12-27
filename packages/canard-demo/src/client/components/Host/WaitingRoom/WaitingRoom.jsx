import React, { Component } from "react";
import Sound from "react-sound";
import "./WaitingRoom.css";

class WaitingRoom extends Component {
  render() {
    return (
      <div className="waitingRoom" style={this.props.isHidden ? { display: 'none' } : {}}>
        <Sound
            url="skype_ringtone.mp3"
            playStatus={this.props.isHidden ? Sound.status.PAUSED : Sound.status.PLAYING}
            loop={true}
            autoLoad={true}
          />
        <div className="roomNumber">
          <span>Host: {this.props.room.roomId}</span>
        </div>
        <button onClick={() => this.props.setStatus("topic")} className="btn">Start Game</button>   
      </div>
    );
  }
};

export default WaitingRoom;
