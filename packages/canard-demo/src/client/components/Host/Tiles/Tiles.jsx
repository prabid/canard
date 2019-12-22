import React, { Component } from "react";
import "./Tiles.css";

class Tiles extends Component {
  state = {
    bluffs: [],
    guesses: []
  }

  async componentDidMount() {
    this.props.canard.onBluffs(bluffs => {
      console.log("onbluffs");
      this.props.setStatus("choosing");
      this.props.canard.triggerResponses({ roomId: this.props.room.roomId, bluffs });
      this.setState(() => ({ bluffs }));
    });
    this.props.canard.onGuesses(guesses => {
      console.log("onguesses");
      this.props.setStatus("choosing");
      this.props.canard.triggerScores({ roomId: this.props.room.roomId });
      this.setState(() => ({ guesses }));
    })
  }

  render() {
    return (
      <div className="tiles" style={this.props.isHidden ? { display: 'none' } : {}}>
        {this.state.bluffs.map((value, index) => {
          return (
            <div className="tile" key={index}>
              {value}
            </div>
          );
        })}
      </div>
    );
  }
};

export default Tiles;
