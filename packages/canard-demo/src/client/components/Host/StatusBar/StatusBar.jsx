import React, { Component } from "react";
import StatusCircle from "./StatusCircle/StatusCircle";
import "./StatusBar.css";

class StatusBar extends Component {
  state = {
    playerStatuses: []
  }

  os = 0;

  async componentDidMount() {
    this.setState({ playerStatuses: this.props.room.players.map(p => ({ name: p.name, isReady: false})) });
    this.os = this.props.canard.onStatuses(playerStatuses => {
      this.setState(() => ({ playerStatuses }));
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
              <span className="statusName">{value["name"]}</span>
              <StatusCircle fill={value["isReady"] ? "green" : "red"}/>
            </div>
          );
        })}
      </div>
    );
  }
};

export default StatusBar;
