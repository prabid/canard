import React, { Component } from "react";
import Sound from "react-sound";
import ResultAnimation from "./ResultAnimation/ResultAnimation";
import "./Results.css";

class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showResults: false
    };
  }

  render() {
    if (!this.state.showResults) {
      return (
        <div className="hostGame results">
          <Sound
              url="results.mp3"
              playStatus={this.props.results.length > 0 ? Sound.status.PLAYING : Sound.status.PAUSED}
              onFinishedPlaying={() => this.setState({ showResults: true })}
            />
        </div>
      );
    }

    return (
      <div className="hostGame results">
        <ResultAnimation results={this.props.results} canard={this.props.canard} room={this.props.room} />
      </div>
    );
  }
};

export default Results;