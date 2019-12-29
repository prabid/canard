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
    this.props.setStatus("waiting");
    this.setState({ bluff: "" });
  };

  onInputChange = e => {
    this.setState({ bluff: e.target.value });
  };

  async componentDidMount() {
    this.props.canard.onPrompt(prompt => {
      this.props.setStatus("bluffing");
    });
  }

  render() {
    return (
      <div className="bluff" style={this.props.isHidden ? { display: 'none' } : {}}>
        <div>
          <div>
            <span>Enter bluff</span>
          </div>
          <div className="bluffInputContainer">
            <input id="bluff" type="text" className="startInput" value={this.state.bluff} onChange={this.onInputChange} />
          </div>
          <div>
            <button onClick={this.handleSubmit} className="btn">Submit</button>
          </div>
        </div>
      </div>
    );
  }
};

export default Bluff;
