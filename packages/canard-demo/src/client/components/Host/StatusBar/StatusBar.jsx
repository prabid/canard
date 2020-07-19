import React, { Component } from "react";
import Sound from "react-sound";
import StatusCircle from "./StatusCircle/StatusCircle";
import "./StatusBar.css";

class StatusBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerStatuses: []
    }
  
    this.getPlayer = this.getPlayer.bind(this);
  }

  os = 0;

  getPlayer(name) {
    for (let i = 0; i < this.state.playerStatuses.length; ++i) {
      let player = this.state.playerStatuses[i];
      if (player.name === name) {
        return player;
      }
    }
    return undefined;
  }

  async componentDidMount() {
    this.setState({ playerStatuses: this.props.room.players.filter(p => p !== undefined).map(p => ({ name: p.name, isReady: false, nowReady: false })) });
    this.os = this.props.canard.onStatuses(playerStatuses => {
      this.setState(() => ({ playerStatuses: playerStatuses.map(p => ({ ...p, nowReady: p.isReady && !this.getPlayer(p.name).isReady })) }));
    });
  }

  async componentWillUnmount() {
    this.props.canard.removeListener("cn-onStatuses", this.os)
  }

  render() {
    return (
      <div className="statusBar" >
        {this.state.playerStatuses.map((value, index) => {
          return (
            <div className="status" key={index}>
              <Sound
                url={"metal-" + index.toString() + ".wav"}
                playStatus={value.nowReady ? Sound.status.PLAYING : Sound.status.PAUSED}
              /> 
              <span className="statusName">{value["name"]}</span>
              <StatusCircle fill={value.isReady ? "green" : "red"}/>
            </div>
          );
        })}
      </div>
    );
  }
};

export default StatusBar;
