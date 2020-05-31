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
        <div className="scoreBoard">
          {this.state.scores.map((value, index) => {
            return (
              <div className="score" key={index}>
                <div className="scoreName">
                  <span>{value["name"]}</span>
                </div>
                <div className="scorePoints">
                  <span>{value["score"]}</span>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={() => this.props.setStatus("topic")} className="btn">Continue</button>
      </div>
    );
  }
};

export default Scores;
