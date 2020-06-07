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

// const tempSpring = {
//   type: "spring",
//   damping: 5
// }

const TOPIC_TIME = 2.5;

class ChoosingTopic extends Component {
  // TODO: topics should have onFunc through socket
  state = {
    topics: [],
    prompt: [],
    topicPicker: "Alpha",
    showPrompt: false,
    roundNum: 0
  }

  timeout = 0;

  async componentDidMount() {
    this.props.canard.onPrompt(prompt => {
      clearInterval(this.timeout);
      console.log(prompt);
      this.setState(() => ({ prompt }));
      this.props.setStatus("bluffing");
      setTimeout(() => {
        this.setState({ showPrompt: true })
      }, TOPIC_TIME * 1000);
    });
    this.props.canard.onTopics(topicData => {
      this.setState(() => ({ topics: topicData["topics"].map((topic, index) => topic + "-" + index.toString()), topicPicker: topicData["topicPicker"] }));
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isHidden && !this.props.isHidden) {
      this.setState({ roundNum: this.state.roundNum + 1 })
      this.props.canard.triggerTopics({roomId: this.props.room.roomId});
      this.timeout = setInterval(() => {
        this.setState({ topics: shuffle(this.state.topics) });
      }, 1000);
    }
    else if (!prevProps.isHidden && this.props.isHidden) {
      this.setState({ topics: [], prompt: [], showPrompt: false });
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
          <motion.div
            animate={{
              scale: [0, 1.0],
            }}
            transition={{ duration: 0.2, times: [0, 1.0] }}
            style={{ fontSize: "43px" }}>
            <span className="topicText">{this.state.prompt[0]}</span>
          </motion.div>
          <motion.div
            animate={{
              scale: [0, 1.0],
            }}
            transition={{ delay: 3, duration: 0.2, times: [0, 1.0]}}
            style={{ fontSize: "43px" }}>
            <span>{this.state.prompt[1]}</span>
          </motion.div>
        </div>
        <StatusBar room={this.props.room} isHidden={!this.state.showPrompt} canard={this.props.canard} />
      </div>
    );
  }
};

export default ChoosingTopic;
