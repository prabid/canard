import React, { Component } from "react";
import "./ChoosingTopic.css";

class ChoosingTopic extends Component {
  // TODO: topics should have onFunc through socket
  state = {
    topics: ["topic1", "topic2", "topic3"],
    prompt: ""
  }

  async componentDidMount() {
    this.props.canard.onPrompt(prompt => {
      console.log('prompt')
      this.setState(() => ({ prompt }));
      this.props.setStatus("bluffing");
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isHidden && !this.props.isHidden) {
      this.props.canard.triggerTopics({roomId: this.props.roomId});
    }
    else if (!prevProps.isHidden && this.props.isHidden) {
      this.setState({ topics: [], prompt: ""});
    }
  }

  render() {
    return (
      <div className="tiles" style={this.props.isHidden ? { display: 'none' } : {}}>
        { this.state.prompt === "" ? "Nada" : <span>Chosen prompt is {this.state.prompt}</span> }
      </div>
    );
  }
};

export default ChoosingTopic;
