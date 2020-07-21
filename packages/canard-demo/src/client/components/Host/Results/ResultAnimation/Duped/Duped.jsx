import React, { Component } from "react";
import Sound from "react-sound";
import { motion } from "framer-motion";

const DUPED_TIME = 0.3;

class Duped extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropSound: false
    };
  }

  dropStart(index) {
    return DUPED_TIME * (index + 1)
  }

  async componentDidMount() {
    setTimeout(() => {
      this.setState({ dropSound: true })
    }, this.dropStart(this.props.index) * 1000);
  }

  render() {
    return (
      <motion.div
        key={this.props.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: this.dropStart(this.props.index) }}
        style={{ padding: "0 10px" }}>
        <Sound
          url="drop.wav"
          playStatus={this.state.dropSound ? Sound.status.PLAYING : Sound.status.PAUSED}
          />
        <span>{this.props.name}</span>
      </motion.div>
    );
  }
};

export default Duped;