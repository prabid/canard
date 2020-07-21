import React, { Component } from "react";
import StatusBar from "../StatusBar/StatusBar";
import Sound from "react-sound";
import "./Prompt.css";
import { motion } from "framer-motion";

const TOPIC_TIME = 2.5;

class Prompt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPrompt: false,
      bgMusic: false
    };
  }

  async componentDidMount() {
    setTimeout(() => {
      this.setState({ showPrompt: true })
    }, (TOPIC_TIME + .5) * 1000);
  }

  render() {
    if (!this.state.showPrompt) {
      return (
        <div className="hostGame prompt" >
          <Sound
            url="boom-1.wav"
            playStatus={Sound.status.PLAYING}
          />
          <div className="chosenTopic">
            <motion.div
              animate={{
                scale: [0, 1.0, 1.0, 0],
              }}
              transition={{ duration: TOPIC_TIME, times: [0, .05, .95, 1.0] }}
              style={{ fontSize: "43px", position: "absolute" }}>
              <span className="topicText">{this.props.prompt[0]}</span>
            </motion.div>
          </div>
        </div>
      );
    }

    return (
      <div className="hostGame prompt" >
        <Sound
            url="prompt.mp3"
            playStatus={this.props.prompt.length > 0 && !this.state.bgMusic ? 
              Sound.status.PLAYING : Sound.status.PAUSED}
            onFinishedPlaying={() => this.setState({ bgMusic: true })}
          />
        <Sound
            url="bum.mp3"
            playStatus={this.state.bgMusic ? Sound.status.PLAYING : Sound.status.PAUSED}
            loop={true}
            volume={1}
          />
        <div className="chosenTopic">
          <div className="chosenPrompt">
            <span>{this.props.prompt[1]}</span>
          </div>
        </div>
        <StatusBar room={this.props.room} canard={this.props.canard} />
      </div>
    );
  }
};

export default Prompt;
