import React, { Component } from "react";
import Start from "../Start/Start";
import ChoosingTopic from "../ChoosingTopic/ChoosingTopic";
import Prompt from "../Prompt/Prompt";
import Tiles from "../Tiles/Tiles";
import Results from "../Results/Results";
import Scores from "../Scores/Scores";
import "./HostGame.css";

class HostGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topics: [],
      topicPicker: "",
      prompt: [],
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
    
    this.props.canard.onTopics(topicData => {
      this.setState(() => ({ topics: topicData["topics"].map((topic, index) => topic + "-" + index.toString()), topicPicker: topicData["topicPicker"] }));
    });

    this.props.canard.onPrompt(prompt => {
      this.setStatus("bluffing");
      this.setState(({ prompt }));
    });

    this.props.canard.onBluffs(bluffs => {
      setTimeout(() => {
        this.setStatus("choosing");
        this.setState(() => ({ bluffs }));
        this.props.canard.triggerResponses({ roomId: this.props.room.roomId, bluffs });
      }, 3000);
    });

    this.props.canard.onGuesses(data => {
      console.log(data);
      let bluffs = data["bluffs"];
      let results = [];

      // Combine players with the same bluffs
      for (let i = 0; i < bluffs.length; ++i) {
        let bluffIndex = -1;
        for (let j = 0; j < results.length; ++j) {
          if (results[j].bluff === bluffs[i].bluff) {
            results[j].names.push(bluffs[i].name);
            bluffIndex = j;
          }
        }
        if (bluffIndex === -1) {
          results.push({ names: [bluffs[i].name], bluff: bluffs[i].bluff, duped: [] })
        }
      }

      // Add correct answer
      results.push({ names: undefined, bluff: data["answer"], duped: [] });

      // Associate each player with the bluff that they chose as the truth
      data["guesses"].forEach(g => {
        for (let i = 0; i < results.length; ++i) {
          if (results[i].bluff === g.guess) {
            results[i].duped.push(g.name);
          }
        }
      });

      // Only show responses that players picked
      results = results.filter(r => r.duped.length !== 0 || r.names === undefined)

      setTimeout(() => {
        this.setStatus("responses");
        this.setState(({ results }));
      }, 3000);
    });

    this.props.canard.onScores(data => {
      if (data["isEnd"]) {
        this.setStatus("end");
      }
      else {
        this.setStatus("viewing");
      }
      this.setState(() => ({ scores: data["scores"], isEnd: data["isEnd"] }));
    });
  }

  setStatus(status) {
    if (status === "topic") {
      this.setState(this.baseState);
    }
    this.setState({ status });
  }

  render() {
    console.log("rerender of hg");
    if (this.state.status === "start") {
      return (
        <Start room={this.props.room} setStatus={this.setStatus} />
      );
    }

    else if (this.state.status === "topic") {
      return (
        <ChoosingTopic room={this.props.room} canard={this.props.canard} topics={this.state.topics}
          topicPicker={this.state.topicPicker} />
      );
    }

    else if (this.state.status === "bluffing") {
      return (
        <Prompt room={this.props.room} canard={this.props.canard} prompt={this.state.prompt} />
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
