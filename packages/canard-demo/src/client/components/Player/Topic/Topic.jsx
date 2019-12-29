import React, { Component } from "react";
import "./Topic.css";

class Topic extends Component {
  state = {
    topics: ["topic1", "topic2", "topic3"]
  }

  handleSubmit = prompt => {
    this.props.canard.sendPrompt({ roomId: this.props.roomId, prompt: prompt, playerId: this.props.playerId })
  };

  async componentDidMount() {
    this.props.canard.onTopics(topics => {
      this.props.setStatus("topic");
      this.setState(() => ({ topics }));
    });
  }

  render() {
    return (
      <div className="topics" style={this.props.isHidden ? { display: 'none' } : {}}>
        <div className="topicHeader">
          <span>Choose a topic!</span>
        </div>
        <div className="topicList">
          {this.state.topics.map((value, index) => {
            return (
              <div className="topic" key={index} onClick={() => this.handleSubmit(value)}>
                {value}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default Topic;
