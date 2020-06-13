import React, { Component } from "react";
import canardClient from "canard-client";
import Header from "../Header/Header";
import Join from "./Join/Join";
import PlayerGame from "./PlayerGame/PlayerGame";
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
  
    this.joinGame = this.joinGame.bind(this);
  }

  canard = null;

  joinGame = async (roomId, name) => {
    this.setState({ gameJoined: true });
    this.canard = await canardClient("http://" + process.env.REACT_APP_BACKEND_SERVER);
    this.canard.onError(error => {
      console.log(error);
      this.setState({ roomId: "", name: "", playerId: "", gameJoined: false, status: "start"});
      return;
    });
    const playerId = await this.canard.joinRoom(roomId, name);

    this.setState(() => ({ playerId, roomId, name }));
  }

  render() {
    if (!this.state.gameJoined) {
      return (
        <div className="player">
          <Header title="CANARD" />
          <Join joinGame={this.joinGame} />
        </div>
      );
    }
    if (this.state.playerId === "") {
      return (
        <div className="player">
          <Header title={this.state.name} />
          <div className="playerGame">
            <span>Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <div className="player">
        <Header title={this.state.name} />
        <PlayerGame canard={this.canard} roomId={this.state.roomId} playerId={this.state.playerId} />
      </div>
    );
  }
}

export default Player;
