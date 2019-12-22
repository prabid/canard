import React, { Component } from "react";
import "./Choose.css";

class Choose extends Component {
  constructor(props) {
    super(props);

    this.state = {
      responses: ["response", "response2", "response3"]
    }
  
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    this.props.canard.sendGuess({ roomId: this.props.roomId, playerId: this.props.playerId, guess: event });
  };

  async componentDidMount() {
    this.props.canard.onResponses(responses => {
      this.setState(() => ({ responses }));
      this.props.setStatus("choosing");
    });
  }

  render() {
    return (
      <div className="tiles" style={this.props.isHidden ? { display: 'none' } : {}}>
        Choosing
        {this.state.responses.map((value, index) => {
          return (
            <div className="tile" key={index} onClick={() => this.handleSubmit(value)}>
              {value}
            </div>
          );
        })}
      </div>
    );
  }
};

export default Choose;
