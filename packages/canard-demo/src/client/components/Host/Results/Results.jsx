import React, { Component } from "react";
import Sound from "react-sound";
import ResultAnimation from "./ResultAnimation/ResultAnimation";
import "./Results.css";

class Results extends Component {
  render() {
    console.log(this.props.results)
    return (
      <div className="hostGame results">
        <Sound
            url="results.mp3"
            playStatus={this.props.results.length > 0 ? Sound.status.PLAYING : Sound.status.PAUSED}
            onFinishedPlaying={() => console.log("Tiles done")}
          />
        <ResultAnimation results={this.props.results} canard={this.props.canard} room={this.props.room} />
      </div>
    );
  }
};

export default Results;