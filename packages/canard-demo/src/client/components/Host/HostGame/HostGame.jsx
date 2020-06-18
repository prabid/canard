import React, { Component } from "react";
import WaitingRoom from "../WaitingRoom/WaitingRoom";
import Scores from "../Scores/Scores";
import Tiles from "../Tiles/Tiles";
import ChoosingTopic from "../ChoosingTopic/ChoosingTopic";
import Results from "../Results/Results";
import "./HostGame.css";

import { TOPIC_TIME } from "../ChoosingTopic/ChoosingTopic";

class HostGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topics: [],
      topicPicker: "",
      prompt: [],
      showPrompt: false,
      bluffs: [],
      results: [],
      answer: "",
      scores: [],
      isEnd: false
    };

    this.baseState = this.state

    this.setStatus = this.setStatus.bind(this);
  }

  async componentDidMount() {
    // Do not want these values overwritten at start of next round, so not included in base state
    this.setState(({ status: "start", roundNum: 0 })); // bluffing, choosing, viewing, topic, waiting, start, end
    console.log(this.props.room);
    this.props.canard.onTopics(topicData => {
      this.setState(() => ({ topics: topicData["topics"].map((topic, index) => topic + "-" + index.toString()), topicPicker: topicData["topicPicker"] }));
    });

    this.props.canard.onPrompt(prompt => {
      this.setState(({ prompt }));
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
      let bluffs = data["bluffs"];
      let r = [];

      // Combine players with the same bluffs
      for (let i = 0; i < bluffs.length; ++i) {
        let bluffIndex = -1;
        for (let j = 0; j < r.length; ++j) {
          if (r[j].bluff === bluffs[i].bluff) {
            r[j].names.push(bluffs[i].name);
            bluffIndex = j;
          }
        }
        if (bluffIndex === -1) {
          r.push({ names: [bluffs[i].name], bluff: bluffs[i].bluff, duped: [] })
        }
      }

      // Add correct answer
      r.push({ names: undefined, bluff: data["answer"], duped: [] });

      // Associate each player with the bluff that they chose as the truth
      data["guesses"].forEach(g => {
        for (let i = 0; i < r.length; ++i) {
          if (r[i].bluff === g.guess) {
            r[i].duped.push(g.name);
          }
        }
      });

      this.setState(({ results: r }));
      this.setStatus("responses");
    });

    this.props.canard.onScores(data => {
      this.setState(() => ({ scores: data["scores"], isEnd: data["isEnd"] }));
      if (data["isEnd"]) {
        this.setStatus("end");
      }
      else {
        this.setStatus("viewing");
      }
    });
  }

  setStatus(status) {
    if (status === "topic") {
      this.setState(this.baseState);
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

    else if (this.state.status === "responses") {
      return (
        <Results room={this.props.room} canard={this.props.canard} results={this.state.results} />
      );
    }

    else if (this.state.status === "viewing" || this.state.status === "end") {
      return (
        <Scores room={this.props.room} setStatus={this.setStatus} canard={this.props.canard} scores={this.state.scores} endGame={this.props.endGame} isEnd={this.state.isEnd} />
      );
    }

    return null;
  }
}

export default HostGame;
