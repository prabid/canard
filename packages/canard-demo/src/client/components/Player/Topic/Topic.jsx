import React, { Component } from "react";
import "./Topic.css";

class Topic extends Component {
  handleSubmit = topic => {
    this.props.canard.chooseTopic({ roomId: this.props.roomId, topic: topic, playerId: this.props.playerId })
  };

  render() {
    return (
      <div className="playerGame">
        <div className="topicHeader">
          <span>Choose a topic!</span>
        </div>
        <div className="topics">
          {this.props.topics.map((topic, index) => {
            return (
              <div className="topic" key={index} onClick={() => this.handleSubmit(topic)}>
                {topic}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default Topic;
