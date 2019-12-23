import React, { Component } from "react";
import canardClient from "canard-client";
import Choose from "./Choose/Choose";
import Bluff from "./Bluff/Bluff";
import Topic from "./Topic/Topic";
import "./Player.css";

class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomId: 0,
      name: "",
      playerId: "",
      status: "start" // bluffing, choosing, viewing, topic, waiting, start, end
    };
  
    this.setStatus = this.setStatus.bind(this);
  }

  canard = null;

  setStatus(status) {
    this.setState({ status })
  }

  async componentDidMount() {
    const { roomId, name } = this.props.location.state || {};

    this.canard = await canardClient("http://localhost:8080");
    this.canard.onError(error => {
      console.log(error);
      this.props.history.push("/");
    });
    const playerId = await this.canard.joinRoom(roomId, name);

    this.setState(() => ({ roomId, name, playerId }));
  }

  render() {
    return (
      <div className="game">
        <div className="playerInfo">
          <span>Player: {this.state.name}</span>
        </div>
        {this.canard && 
          (<Bluff roomId={this.state.roomId} playerId={this.state.playerId} setStatus={this.setStatus} isHidden={this.state.status !== "bluffing"} canard={this.canard} />)}
        {this.canard && 
          (<Topic roomId={this.state.roomId} playerId={this.state.playerId} setStatus={this.setStatus} isHidden={this.state.status !== "topic"} canard={this.canard} />)}
        {this.canard && 
          (<Choose roomId={this.state.roomId} playerId={this.state.playerId} setStatus={this.setStatus} isHidden={this.state.status !== "choosing"} canard={this.canard} />)}
      </div>
    );
  }
}

export default Player;
