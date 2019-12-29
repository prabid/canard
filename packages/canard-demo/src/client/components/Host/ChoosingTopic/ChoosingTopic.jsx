import React, { Component } from "react";
import "./ChoosingTopic.css";
import { motion } from "framer-motion";
import { shuffle } from "lodash";

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

const tempSpring = {
  type: "spring",
  damping: 5
}

class ChoosingTopic extends Component {
  // TODO: topics should have onFunc through socket
  state = {
    topics: [],
    prompt: [],
    topicPicker: "Alpha"
  }

  timeout = 0;

  async componentDidMount() {
    this.props.canard.onPrompt(prompt => {
      clearInterval(this.timeout);
      console.log(prompt);
      this.setState(() => ({ prompt }));
      this.props.setStatus("bluffing");
    });
    this.props.canard.onTopics(topicData => {
      this.setState(() => ({ topics: topicData["topics"], topicPicker: topicData["topicPicker"]["name"] }));
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isHidden && !this.props.isHidden) {
      this.props.canard.triggerTopics({roomId: this.props.room.roomId});
      this.timeout = setInterval(() => {
        this.setState({ topics: shuffle(this.state.topics) });
      }, 1000);
    }
    else if (!prevProps.isHidden && this.props.isHidden) {
      this.setState({ topics: [], prompt: [] });
    }
  }

  render() {
    if (this.state.prompt.length === 0) {
      return (
        <div className="choosingTopic" style={this.props.isHidden ? { display: 'none' } : {}}>
          <div className="choosingTopicHeader">
            <span>{this.state.topicPicker} is choosing the topic</span>
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
    return (
      <div className="choosingTopic" style={this.props.isHidden ? { display: 'none' } : {}}>
        <div className="chosenTopic">
          <motion.li
            animate={{
              scale: [1.0, 2.0, 2.0, 0],
            }}
            layoutTransition={tempSpring}
            transition={{ duration: 4, times: [0, .05, .9, 1.0] }}
            style={{ background: "#ABABAB", position: "absolute", zIndex: 1, backfaceVisibility: "hidden" }}>
            <span className="topicText">{this.state.prompt[0]}</span>
          </motion.li>
          <motion.div
            animate={{
              scale: [0, 0, 1.0],
            }}
            transition={{ duration: 5, times: [0, .9, 1.0]}}
            style={{ fontSize: "50px" }}>
            <span>{this.state.prompt[1]}</span>
          </motion.div>
        </div>
      </div>
    );
  }
};

export default ChoosingTopic;
