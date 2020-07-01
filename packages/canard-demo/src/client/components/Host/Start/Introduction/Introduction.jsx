import React, { Component } from "react";
import Sound from "react-sound";
import "./Introduction.css";

class Introduction extends Component {
  render() {
    return (
      <div className="hostGame introduction">
        <Sound
            url="intro.mp3"
            playStatus={Sound.status.PLAYING}
            onFinishedPlaying={() => this.props.setStatus("topic")}
          /> 
      </div>
    );
  }
};

export default Introduction;
