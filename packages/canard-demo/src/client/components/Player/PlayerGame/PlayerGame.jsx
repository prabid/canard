import React, { Component } from "react";
import Bluff from "../Bluff/Bluff";
import Topic from "../Topic/Topic";
import Choose from "../Choose/Choose";
import "./PlayerGame.css";

class PlayerGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: "start", // bluffing, choosing, viewing, topic, waiting, start, end
      topics: [],
      responses: []
    };

    this.setStatus = this.setStatus.bind(this);
  }

  async componentDidMount() {
    this.props.canard.onTopics(topics => {
      this.setStatus("topic");
      this.setState(() => ({ topics }));
    });

    this.props.canard.onPrompt(prompt => {
      this.setStatus("bluffing");
    });

    this.props.canard.onResponses(responses => {
      this.setState(() => ({ responses }));
      this.setStatus("choosing");
    });

    this.props.canard.gameEnd(() => {
      this.props.endGame();
    });
  }

  setStatus(status) {
    if (status === "topic") {
      this.setState({ responses: [] });
    }
    this.setState({ status });
  }

  render() {
    if (this.state.status === "topic") {
      return (
        <Topic roomId={this.state.roomId} playerId={this.props.playerId} setStatus={this.setStatus} canard={this.props.canard} topics={this.state.topics} />
      );
    }

    else if (this.state.status === "bluffing") {
      return (
        <Bluff roomId={this.state.roomId} playerId={this.props.playerId} setStatus={this.setStatus} canard={this.props.canard} />
      );
    }

    else if (this.state.status === "choosing") {
      return (
        <Choose roomId={this.state.roomId} playerId={this.props.playerId} setStatus={this.setStatus} canard={this.props.canard} responses={this.state.responses} />
      );
    }

    return null;
  }
}

export default PlayerGame;
