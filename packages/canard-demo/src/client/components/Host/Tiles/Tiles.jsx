import React, { Component } from "react";
import StatusBar from "../StatusBar/StatusBar";
import "./Tiles.css";

class Tiles extends Component {
  render() {
    return (
      <div className="hostGame tiles" >
        <div className="tileList">
          {this.props.bluffs.map((value, index) => {
            return (
              <div className="tile" key={index}>
                <span>{value}</span>
              </div>
            );
          })}
        </div>
        <StatusBar room={this.props.room} canard={this.props.canard} />
      </div>
    );
  }
};

export default Tiles;
