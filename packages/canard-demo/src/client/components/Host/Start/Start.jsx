import React, { Component } from "react";
import WaitingRoom from "./WaitingRoom/WaitingRoom";
import Introduction from "./Introduction/Introduction";

class Start extends Component {
  constructor(props) {
    super(props);

    this.state = {
      intro: false
    };

    this.playIntro = this.playIntro.bind(this);
  }

  playIntro() {
    this.setState({ intro: true });
  }

  render() {
    if (!this.state.intro) {
      return (
        <WaitingRoom room={this.props.room} playIntro={this.playIntro} />
      );
    }

    return (
      <Introduction setStatus={this.props.setStatus} />
    );
  }
};

export default Start;
