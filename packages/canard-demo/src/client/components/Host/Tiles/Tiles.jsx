import React, { Component } from "react";
import Sound from "react-sound";
import StatusBar from "../StatusBar/StatusBar";
import "./Tiles.css";

class Tiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bgMusic: false
    };
  }

  render() {
    console.log(this.props.bluffs);
    return (
      <div className="hostGame tiles" >
        <Sound
            url="tiles.mp3"
            playStatus={this.props.bluffs.length > 0 && !this.state.bgMusic ? 
              Sound.status.PLAYING : Sound.status.PAUSED}
            onFinishedPlaying={() => this.setState({ bgMusic: true })}
          />
        <Sound
            url="bum.mp3"
            playStatus={this.state.bgMusic ? Sound.status.PLAYING : Sound.status.PAUSED}
            loop={true}
            volume={1}
          />
        <div className="tileList">
          {this.props.bluffs.map((value, index) => {
            return (
              <div className="tile" key={index}>
                <span>{value}</span>
              </div>
            );
          })}
        </div>
        <StatusBar room={this.props.room} canard={this.props.canard} />
      </div>
    );
  }
};

export default Tiles;
