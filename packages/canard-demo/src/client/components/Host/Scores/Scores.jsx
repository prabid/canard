import React, { Component } from "react";
import "./Scores.css";

class Scores extends Component {
  render() {
    return (
      <div className="hostGame scores" >
        <div className="scoreBoard">
          {this.props.scores.map((value, index) => {
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
