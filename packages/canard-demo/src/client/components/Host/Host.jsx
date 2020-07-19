import React, { Component } from "react";
import canardClient from "canard-client";
import HostGame from "./HostGame/HostGame";
import "./Host.css";

class Host extends Component {
  constructor(props) {
    super(props);

    this.state = {
      room: null,
      gameStarted: false
    };

    this.baseState = this.state;
  
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  canard = null;

  startGame = async () => {
    this.setState({ gameStarted: true });
    console.log(process.env.REACT_APP_BACKEND_SERVER); 
    this.canard = await canardClient("http://" + process.env.REACT_APP_BACKEND_SERVER);
    const room = await this.canard.createRoom();
    this.setState(() => ({ room }));

    this.canard.onPlayerJoin(room => {
      for (let i = room.players.length; i < 8; ++i) {
        room.players.push(undefined);
      }
      this.setState(() => ({ room }));
      console.log(room.players);
    });
  }

  endGame() {
    this.setState(this.baseState);
  }

  render() {
    if (!this.state.gameStarted) {
      return (
        <div className="host">
          <div className="hostGame">
            <div className="hostHeader">
              <span>Choose a game</span>
            </div>
            <div>
              <select value={this.state.gameType} onChange={(e) => this.setState(({ gameType: e.target.value }))}>
                <option value="moviebluff">Movie Bluff</option>
              </select>
            </div>
            <div className="createGameBtn">
              <button onClick={this.startGame} className="btn">Create Game</button>
            </div>
          </div>
        </div>
      );
    }

    if (!this.state.room) {
      return (
        <div className="host">
          <div className="hostGame">
            <span>Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="host">
        <HostGame room={this.state.room} canard={this.canard} endGame={this.endGame} />
      </div>
    );
  }
}

export default Host;
