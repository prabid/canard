import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./Landing.css";

class Landing extends Component {
  state = {
    roomId: "",
    name: ""
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onClickJoin = async () => {
    this.props.history.push({
      pathname: 'player',
      state: this.state
    })
  };

  onRouteChange = () => {
    this.props.history.push('host');
  };

  render() {
    const { roomId, name } = this.state;
    return (
      <div className="landing">
        <div>Landing</div>
        <div>
          <input name="roomId" value={roomId} onChange={this.onInputChange} />
          <input name="name" value={name} onChange={this.onInputChange} />
          <button onClick={this.onClickJoin} className="btn">Join Game</button>
        </div>
        <div>
          <button onClick={this.onRouteChange} className="btn">Create Game</button>
        </div>
      </div>
    );
  }
}

export default withRouter(Landing);
