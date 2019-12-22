import React, { Component } from "react";
import "./Topic.css";

class Topic extends Component {
  // First to choose a topic wins?
  state = {
    topics: ["topic1", "topic2", "topic3"]
  }

  handleSubmit = prompt => {
    this.props.canard.sendPrompt({ roomId: this.props.roomId, prompt: prompt, playerId: this.props.playerId })
  };

  async componentDidMount() {
    console.log("mounted player topic");
    this.props.canard.onTopics(topics => {
      this.props.setStatus("topic");
      this.setState(() => ({ topics }));
    });
  }

  render() {
    return (
      <div className="topic" style={this.props.isHidden ? { display: 'none' } : {}}>
        {this.state.topics.map((value, index) => {
          return (
            <div className="topic" key={index} onClick={() => this.handleSubmit(value)}>
              {value}
            </div>
          );
        })}
      </div>
    );
  }
};

export default Topic;
