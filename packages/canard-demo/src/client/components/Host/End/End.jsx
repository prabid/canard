import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./End.css";

class End extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: ""
    }
  
    this.gotoHome = this.gotoHome.bind(this);
  }

  gotoHome = () => {
    this.props.endGame();
  };

  async componentDidMount() {
    const winner = this.props.endScores.reduce((max, s) => s["score"] > max["score"] ? s : max, this.props.endScores[0])["name"];
    this.setState(() => ({ winner }));
  }

  render() {
    return (
      <div className="hostGame end" >
        <div className="winner">
          <span>{this.state.winner} wins the game!</span>
        </div>
        {this.props.endScores.map((value, index) => {
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
