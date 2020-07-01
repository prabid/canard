import React, { Component } from "react";
import "./Scores.css";

class Scores extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: ""
    }
  
    this.cont = this.cont.bind(this);
  }

  cont = () => {
    if (this.props.isEnd) {
      this.props.endGame();
    }
    else {
      this.props.setStatus("topic");
    }
  };

  async componentDidUpdate(prevProps) {
    if (!prevProps.isEnd && this.props.isEnd) {
      const winner = this.props.scores.reduce((max, s) => s["score"] > max["score"] ? s : max, this.props.scores[0]);
      this.setState(() => ({ winner: winner["name"] }));
    }
  }

  render() {
    console.log(this.state.winner);
    return (
      <div className="hostGame scores" >
        <div className="winner" style={this.props.isEnd ? {} : { display: 'none' }}>
          <span>{this.state.winner} wins the game!</span>
        </div>
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
        <button onClick={this.cont} className="btn">{this.props.isEnd ? "Return to Main Screen" : "Continue"}</button>
      </div>
    );
  }
};

export default Scores;
