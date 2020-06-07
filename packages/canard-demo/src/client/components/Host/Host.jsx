import React, { Component } from "react";
import canardClient from "canard-client";
import Header from "../Header/Header";
import WaitingRoom from "./WaitingRoom/WaitingRoom";
import Scores from "./Scores/Scores";
import Tiles from "./Tiles/Tiles";
import ChoosingTopic from "./ChoosingTopic/ChoosingTopic";
import End from "./End/End";
import "./Host.css";

class Host extends Component {
  constructor(props) {
    super(props);

    this.state = {
      room: null,
      gameStarted: false,
      status: "start" // bluffing, choosing, viewing, topic, waiting, start, end
    };
  
    this.setStatus = this.setStatus.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  canard = null;

  setStatus(status) {
    this.setState({ status });
  }

  startGame = async () => {
    this.setState({ gameStarted: true });
    console.log(process.env.REACT_APP_IP); 
    this.canard = await canardClient("http://" + process.env.REACT_APP_IP);
    const room = await this.canard.createRoom();
    this.setState(() => ({ room }));

    this.canard.onPlayerJoin(room => {
      this.setState(() => ({ room }));
    });
  }

  render() {
    if (!this.state.gameStarted) {
      return (
        <div className="host">
          <Header title="CANARD" />
          <div className="playerGame">
            <div className="hostHeader">
              <span>Choose a game</span>
            </div>
            <div>
              <select value={this.state.gameType} onChange={(e) => this.setState(({ gameType: e.target.value }))}>
                <option value="moviebluff">Movie Bluff</option>
              </select>
            </div>
            <div className="startGameBtn">
              <button onClick={this.startGame} className="btn">Create Game</button>
            </div>
          </div>
        </div>
      );
    }

    if (!this.state.room) {
      return (
        <div className="host">
          <Header title="CANARD" />
          <div className="playerGame">
            <span>Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="host">
        <Header title="CANARD" />
        <div className="hostGame">
          <WaitingRoom room={this.state.room} setStatus={this.setStatus} isHidden={this.state.status !== "start"} />
          <ChoosingTopic room={this.state.room} setStatus={this.setStatus} 
            isHidden={this.state.status !== "topic" && this.state.status !== "bluffing"} canard={this.canard} />
          <Scores room={this.state.room} setStatus={this.setStatus} 
            isHidden={this.state.status !== "viewing"} canard={this.canard} />
          <Tiles room={this.state.room} setStatus={this.setStatus} 
            isHidden={this.state.status !== "choosing"} canard={this.canard} />
          <End room={this.state.room} setStatus={this.setStatus} 
            isHidden={this.state.status !== "end"} canard={this.canard} />
        </div>
      </div>
    );
  }
}

export default Host;
