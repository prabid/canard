import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./End.css";

class End extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scores: [],
      winner: ""
    }
  
    this.gotoHome = this.gotoHome.bind(this);
  }

  gotoHome = () => {
    this.props.history.push('/host');
  };

  async componentDidMount() {
    this.props.canard.onEndGame((scores) => {
      this.props.setStatus("end");
      const winner = scores.reduce((max, s) => s["score"] > max["score"] ? s : max, scores[0])["name"];
      this.setState(() => ({ scores, winner }));
    });
  }

  render() {
    return (
      <div className="endScores" style={this.props.isHidden ? { display: 'none' } : {}}>
        <div className="winner">
          <span>{this.state.winner} wins the game!</span>
        </div>
        {this.state.scores.map((value, index) => {
          return (
            <div className="endScore" key={index}>
              {value["name"]}: {value["score"]}
            </div>
          );
        })}
        <button onClick={this.gotoHome} className="btn">Return to Main Screen</button>
      </div>
    );
  }
};

export default withRouter(End);
