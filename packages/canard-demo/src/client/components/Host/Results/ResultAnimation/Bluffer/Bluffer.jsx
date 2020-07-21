import React, { Component } from "react";
import Sound from "react-sound";
import { motion } from "framer-motion";

const REVEAL_TIME = 2;

class Bluffer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      revealSound: false
    };

    this.setReveal = this.setReveal.bind(this);
  }

 setReveal() {
    setTimeout(() => {
      this.setState({ revealSound: true })
    }, REVEAL_TIME * 1000);
  }

  async componentDidMount() {
    this.setReveal();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.index !== this.props.index) {
      this.setReveal();
    }
  }

  render() {
    return (
      <motion.div
        key={this.props.index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: REVEAL_TIME }}>
        <Sound
          url="tada.wav"
          playStatus={this.props.isTruth && this.state.revealSound ? Sound.status.PLAYING : Sound.status.PAUSED}
          onFinishedPlaying={() => this.setState({ revealSound: false })}
          />
        <Sound
          url="fart.wav"
          playStatus={!this.props.isTruth && this.state.revealSound ? Sound.status.PLAYING : Sound.status.PAUSED}
          onFinishedPlaying={() => this.setState({ revealSound: false })}
          />
        <span>{this.props.name}</span>
      </motion.div>
    );
  }
};

export default Bluffer;