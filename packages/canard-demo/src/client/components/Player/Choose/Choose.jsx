import React, { Component } from "react";
import "./Choose.css";

class Choose extends Component {
  constructor(props) {
    super(props);
  
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    this.props.canard.sendGuess({ roomId: this.props.roomId, playerId: this.props.playerId, guess: event });
    this.props.setStatus("waiting");
  };

  render() {
    return (
      <div className="playerGame">
        <div className="chooseHeader">
          <span>Choose the correct answer</span>
        </div>
        <div className="playerTiles">
          {this.props.responses.map((value, index) => {
            return (
              <div className="playerTile" key={index} onClick={() => this.handleSubmit(value)}>
                {value}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default Choose;
