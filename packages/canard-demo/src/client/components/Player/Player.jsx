import React, { Component } from "react";
import canardClient from "canard-client";
import Header from "../Header/Header";
import Choose from "./Choose/Choose";
import Bluff from "./Bluff/Bluff";
import Topic from "./Topic/Topic";
import "./Player.css";

class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomId: "",
      name: "",
      playerId: "",
      gameType: "moviebluff",
      gameJoined: false,
      status: "start" // bluffing, choosing, viewing, topic, waiting, start, end
    };
  
    this.setStatus = this.setStatus.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }

  canard = null;

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  setStatus(status) {
    this.setState({ status });
  }

  joinGame = async () => {
    this.setState({ gameJoined: true });
    this.canard = await canardClient("http://localhost:8080");
    this.canard.onError(error => {
      console.log(error);
      this.setState({ roomId: "", name: "", playerId: "", gameJoined: false, status: "start"});
      return;
    });
    const playerId = await this.canard.joinRoom(this.state.roomId, this.state.name);

    this.setState(() => ({ playerId }));
  }

  render() {
    if (!this.state.gameJoined) {
      return (
        <div className="player">
          <Header title="CANARD" />
          <div className="game">
            <div><span>Room Id</span></div>
            <div>
              <input name="roomId" value={this.state.roomId} onChange={this.onInputChange} />
            </div>
            <div><span>Name</span></div>
            <div>
              <input name="name" value={this.state.name} onChange={this.onInputChange} />
            </div>
            <div>
              <button onClick={this.joinGame} className="btn">Join Game</button>
            </div>
          </div>
        </div>
      );
    }
    if (this.state.playerId === "") {
      return (
        <div className="player">
          <Header title={this.state.name} />
          <div className="game">
            <span>Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <div className="player">
        <Header title={this.state.name} />
        <div className="game">
          <Bluff roomId={this.state.roomId} playerId={this.state.playerId} setStatus={this.setStatus} isHidden={this.state.status !== "bluffing"} canard={this.canard} />
          <Topic roomId={this.state.roomId} playerId={this.state.playerId} setStatus={this.setStatus} isHidden={this.state.status !== "topic"} canard={this.canard} />
          <Choose roomId={this.state.roomId} playerId={this.state.playerId} setStatus={this.setStatus} isHidden={this.state.status !== "choosing"} canard={this.canard} />
        </div>
      </div>
    );
  }
}

export default Player;
