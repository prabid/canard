import React, { Component } from "react";
import "./Scores.css";

class Scores extends Component {
  state = {
    scores: ["score1", "score2", "score3"]
  }

  async componentDidMount() {
    this.props.canard.onScores(scores => {
      this.setState(() => ({ scores }));
      this.props.setStatus("viewing");
    });
  }

  render() {
    return (
      <div className="scores" style={this.props.isHidden ? { display: 'none' } : {}}>
        <div className="points">
          {this.state.scores.map((value, index) => {
            return (
              <div className="score" key={index}>
                {value["name"]}: {value["score"]}
              </div>
            );
          })}
        </div>
        <button onClick={() => this.props.setStatus("topic")}>Continue</button>
      </div>
    );
  }
};

export default Scores;
