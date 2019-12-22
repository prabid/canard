import React, { Component } from "react";
import "./Bluff.css";

class Bluff extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bluff: ""
    }
  
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.canard.sendBluff({ roomId: this.props.roomId, playerId: this.props.playerId, bluff: this.state.bluff });
  };

  onInputChange = e => {
    this.setState({ bluff: e.target.value });
  };

  async componentDidMount() {
    this.props.canard.onPrompt(prompt => {
      console.log('prompt')
      this.props.setStatus("bluffing");
    });
  }

  render() {
    return (
      <div className="bluff" style={this.props.isHidden ? { display: 'none' } : {}}>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>Enter bluff</label>
            <input id="bluff" type="text" value={this.state.bluff} onChange={this.onInputChange} />

            <button>Submit</button>
          </form>
        </div>
      </div>
    );
  }
};

export default Bluff;
