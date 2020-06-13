import React, { Component } from "react";
import WaitingRoom from "../WaitingRoom/WaitingRoom";
import Scores from "../Scores/Scores";
import Tiles from "../Tiles/Tiles";
import ChoosingTopic from "../ChoosingTopic/ChoosingTopic";
import End from "../End/End";
import "./HostGame.css";

import { TOPIC_TIME } from "../ChoosingTopic/ChoosingTopic";

class HostGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roundNum: 0,
      topics: [],
      topicPicker: "",
      prompt: [],
      showPrompt: false,
      bluffs: [],
      guesses: [],
      answer: "",
      scores: [],
      endScores: [],
      status: "start" // bluffing, choosing, viewing, topic, waiting, start, end
    };

    this.setStatus = this.setStatus.bind(this);
  }

  async componentDidMount() {
    console.log(this.props.room);
    this.props.canard.onTopics(topicData => {
      this.setState(() => ({ topics: topicData["topics"].map((topic, index) => topic + "-" + index.toString()), topicPicker: topicData["topicPicker"] }));
    });

    this.props.canard.onPrompt(prompt => {
      console.log(prompt);
      this.setState(() => ({ prompt }));
      this.setStatus("bluffing");
      setTimeout(() => {
        this.setState({ showPrompt: true })
      }, (TOPIC_TIME + .5) * 1000);
    });

    this.props.canard.onBluffs(bluffs => {
      setTimeout(() => {
        this.setStatus("choosing");
        this.props.canard.triggerResponses({ roomId: this.props.room.roomId, bluffs });
      }, 1000);
      this.setState(() => ({ bluffs }));
    });

    this.props.canard.onGuesses(data => {
      this.setStatus("choosing");
      this.props.canard.triggerScores({ roomId: this.props.room.roomId });
      this.setState(() => ({ guesses: data["guesses"], answer: data["answer"] }));
    });

    this.props.canard.onScores(scores => {
      this.setState(() => ({ scores }));
      this.setStatus("viewing");
    });

    this.props.canard.onEndGame((endScores) => {
      this.setState(() => ({ endScores }));
      this.setStatus("end");
    });
  }

  setStatus(status) {
    if (status === "topic") {
      this.setState({ roundNum: this.state.roundNum + 1, topics: [], topicPicker: "", prompt: [], showPrompt: false, bluffs: [], guesses: [], answer: "" });
    }
    this.setState({ status });
  }

  render() {
    if (this.state.status === "start") {
      return (
        <WaitingRoom room={this.props.room} setStatus={this.setStatus} />
      );
    }

    else if (this.state.status === "topic" || this.state.status === "bluffing") {
      return (
        <ChoosingTopic room={this.props.room} setStatus={this.setStatus} canard={this.props.canard} topics={this.state.topics}
          topicPicker={this.state.topicPicker} prompt={this.state.prompt} showPrompt={this.state.showPrompt} />
      );
    }

    else if (this.state.status === "choosing") {
      return (
        <Tiles room={this.props.room} setStatus={this.setStatus} canard={this.props.canard} 
          bluffs={this.state.bluffs} guesses={this.state.guesses} answer={this.state.answer} />
      );
    }

    else if (this.state.status === "viewing") {
      return (
        <Scores room={this.props.room} setStatus={this.setStatus} canard={this.props.canard} scores={this.state.scores} />
      );
    }

    else if (this.state.status === "end") {
      return (
        <End room={this.props.room} setStatus={this.setStatus} canard={this.props.canard} endScores={this.state.endScores} endGame={this.props.endGame} />
      );
    }
  }
}

export default HostGame;
