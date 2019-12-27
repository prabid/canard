import React, { Component } from "react";
import "./ChoosingTopic.css";

class ChoosingTopic extends Component {
  // TODO: topics should have onFunc through socket
  state = {
    topics: [],
    prompt: ""
  }

  async componentDidMount() {
    this.props.canard.onPrompt(prompt => {
      this.setState(() => ({ prompt }));
      this.props.setStatus("bluffing");
    });
    this.props.canard.onTopics(topics => {
      this.setState(() => ({ topics }));
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isHidden && !this.props.isHidden) {
      this.props.canard.triggerTopics({roomId: this.props.room.roomId});
    }
    else if (!prevProps.isHidden && this.props.isHidden) {
      this.setState({ topics: [], prompt: ""});
    }
  }

  render() {
    return (
      <div className="choosingTopic" style={this.props.isHidden ? { display: 'none' } : {}}>
        { this.state.prompt === "" ?
          this.state.topics.map((value, index) => {
            return (
              <div className="chooseTopic" key={index}>
                {value}
              </div>
            );
          }) : 
          <span>Chosen prompt is {this.state.prompt}</span> }
      </div>
    );
  }
};

export default ChoosingTopic;
