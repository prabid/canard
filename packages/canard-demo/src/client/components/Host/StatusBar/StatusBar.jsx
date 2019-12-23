import React, { Component } from "react";
import StatusCircle from "./StatusCircle/StatusCircle";
import "./StatusBar.css";

class StatusBar extends Component {
  state = {
    playerStatuses: []
  }

  async componentDidMount() {
    this.props.canard.onStatuses(playerStatuses => {
      this.setState(() => ({ playerStatuses }));
    });
  }

  render() {
    return (
      <div className="statusBar" style={this.props.isHidden ? { display: 'none' } : {}}>
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
