import React, { Component } from "react";
import "./Tiles.css";

class Tiles extends Component {
  state = {
    bluffs: [],
    guesses: [],
    answer: ""
  }

  async componentDidMount() {
    this.props.canard.onBluffs(bluffs => {
      setTimeout(() => {
        this.props.setStatus("choosing");
        this.props.canard.triggerResponses({ roomId: this.props.room.roomId, bluffs });
      }, 3000);
      this.setState(() => ({ bluffs }));
    });
    this.props.canard.onGuesses(data => {
      this.props.setStatus("choosing");
      this.props.canard.triggerScores({ roomId: this.props.room.roomId });
      this.setState(() => ({ guesses: data["guesses"], answer: data["answer"] }));
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
