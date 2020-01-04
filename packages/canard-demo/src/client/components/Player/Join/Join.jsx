import React, { Component } from "react";
import "./Join.css";

class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomId: "",
      name: "",
    };
  }

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="playerGame">
        <div>
          <span>Room Id</span>
        </div>
        <div>
          <input name="roomId" className="startInput" value={this.state.roomId} onChange={this.onInputChange} />
        </div>
        <div>
          <span>Name</span>
        </div>
        <div>
          <input name="name" className="startInput" value={this.state.name} onChange={this.onInputChange} />
        </div>
        <div>
          <button onClick={() => this.props.joinGame(this.state.roomId, this.state.name)} className="btn">Join Game</button>
        </div>
      </div>
    );
  }
};

export default Join;
