import React, { Component } from "react";
import canardClient from "canard-client";
import Scores from "./Scores/Scores";
import Tiles from "./Tiles/Tiles";
import StatusBar from "./StatusBar/StatusBar";
import ChoosingTopic from "./ChoosingTopic/ChoosingTopic";

class Host extends Component {
  constructor(props) {
    super(props);

    this.state = {
      room: {},
      status: "start" // bluffing, choosing, viewing, topic, waiting, start
    };
  
    this.setStatus = this.setStatus.bind(this);
  }

  canard = null;

  async componentDidMount() {
    this.canard = await canardClient("http://localhost:8080");
    const room = await this.canard.createRoom();
    this.setState(() => ({ room }));

    this.canard.onPlayerJoin(room => {
      this.setState(() => ({ room }));
    });
  }

  setStatus(status) {
    this.setState({ status })
  }

  render() {
    const { room } = this.state;
    console.log(room);
    if (!room) {
      return <div>Loading...</div>;
    }
    return (
      <div className="game">
        <div>
          <span>Host: {this.state.room.roomId}</span>
        </div>
        {this.state.status === "start" ? <button onClick={() => this.setStatus("topic")}>Start Game</button> : ""}
        {this.state.room.roomId && 
          (<ChoosingTopic roomId={this.state.room.roomId} setStatus={this.setStatus} 
            isHidden={this.state.status !== "topic" && this.state.status !== "bluffing"} canard={this.canard} />)}
        {this.state.room.roomId && 
          (<Scores room={this.state.room} setStatus={this.setStatus} 
            isHidden={this.state.status !== "viewing"} canard={this.canard} />)}
        {this.state.room.roomId && 
          (<Tiles room={this.state.room} setStatus={this.setStatus} 
            isHidden={this.state.status !== "choosing"} canard={this.canard} />)}
        {this.state.room.roomId && 
          (<StatusBar room={this.state.room}
            isHidden={this.state.status !== "choosing" && this.state.status !== "bluffing"} canard={this.canard} />)}
      </div>
    );
  }
}

export default Host;
