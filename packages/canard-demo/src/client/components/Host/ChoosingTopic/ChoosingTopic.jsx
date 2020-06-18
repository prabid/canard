import React, { Component } from "react";
import StatusBar from "../StatusBar/StatusBar";
import "./ChoosingTopic.css";
import { motion } from "framer-motion";
import { shuffle } from "lodash";

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

export const TOPIC_TIME = 2.5;

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

  componentDidUpdate(prevProps) {
    if (prevProps.prompt.length === 0 && this.props.prompt.length !== 0) {
      clearInterval(this.interval);
    }
  }

  render() {
    if (this.props.prompt.length === 0) {
      return (
        <div className="hostGame choosingTopic">
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

    else if (!this.props.showPrompt) {
      return (
        <div className="hostGame choosingTopic" >
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
      <div className="hostGame choosingTopic" >
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

export default ChoosingTopic;
