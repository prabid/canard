import React, { Component } from "react";
import "./Topic.css";

class Topic extends Component {
  state = {
    topics: ["topic1", "topic2", "topic3"]
  }

  handleSubmit = topic => {
    this.props.canard.chooseTopic({ roomId: this.props.roomId, topic: topic, playerId: this.props.playerId })
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
          {this.state.topics.map((topic, index) => {
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
