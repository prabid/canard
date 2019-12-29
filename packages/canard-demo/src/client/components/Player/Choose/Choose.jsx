import React, { Component } from "react";
import "./Choose.css";

class Choose extends Component {
  constructor(props) {
    super(props);

    this.state = {
      responses: []
    }
  
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    this.props.canard.sendGuess({ roomId: this.props.roomId, playerId: this.props.playerId, guess: event });
    this.props.setStatus("waiting");
  };

  async componentDidMount() {
    this.props.canard.onResponses(responses => {
      this.setState(() => ({ responses }));
      this.props.setStatus("choosing");
    });
  }

  render() {
    return (
      <div className="playerTiles" style={this.props.isHidden ? { display: 'none' } : {}}>
        <div className="chooseHeader">
          <span>Choose the correct answer</span>
        </div>
        {this.state.responses.map((value, index) => {
          return (
            <div className="playerTile" key={index} onClick={() => this.handleSubmit(value)}>
              {value}
            </div>
          );
        })}
      </div>
    );
  }
};

export default Choose;
