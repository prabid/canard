import React, { Component } from "react";
import Sound from "react-sound";
import { motion } from "framer-motion";
import { shuffle } from "lodash";
import "./ChoosingTopic.css";

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

class ChoosingTopic extends Component {
  // TODO: topics should have onFunc through socket
  state = {
    topics: []
  }

  interval = 0;

  async componentDidMount() {
    this.setState({ topics: this.props.topics })
    this.props.canard.triggerTopics({roomId: this.props.room.roomId});
    this.interval = setInterval(() => {
      this.setState({ topics: shuffle(this.state.topics) });
    }, 1000);
  }

  async componentDidUpdate() {
    if (this.props.topics.length > 0 && this.state.topics.length === 0) {
      this.setState({ topics: this.props.topics })
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (this.props.topicPicker !== "") {
      return (
        <div className="hostGame choosingTopic">
          <Sound
            url="bum.mp3"
            playStatus={Sound.status.PLAYING}
            loop={true}
            volume={1}
          />
          <div className="choosingTopicHeader">
            <span>{this.props.topicPicker} is choosing the topic</span>
          </div>
          <ul>
            {this.state.topics.map(background => (
              <motion.li
                key={background}
                layoutTransition={spring}
                style={{ background: "#ABABAB" }}>
              </motion.li>
            ))}
          </ul>
        </div>
      );  
    }
    return null;
  }
};

export default ChoosingTopic;
