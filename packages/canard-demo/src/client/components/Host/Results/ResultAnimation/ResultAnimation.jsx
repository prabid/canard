import React, { Component } from "react";
import Sound from "react-sound";
import { motion } from "framer-motion";
import Bluffer from "./Bluffer/Bluffer";
import Duped from "./Duped/Duped";

const RESPONSE_TIME = 5;

class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      num: 0
    };
  }

  blufferHeader(names) {
    if (names === undefined) {
      return "The Truth!";
    }
    return names.join(" and ").concat("'s Lie!");
  }

  async componentDidMount() {
    setTimeout(() => {
      this.setState({ num: this.state.num + 1 })
    }, RESPONSE_TIME * 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    // If all results have been displayed, get scores
    if (this.state.num >= this.props.results.length) {
      this.props.canard.triggerScores({ roomId: this.props.room.roomId });
    }
    // Else show next result
    else if (prevState !== this.state) {
      setTimeout(() => {
        this.setState({ num: this.state.num + 1 })
      }, RESPONSE_TIME * 1000);
    }
  }

  render() {
    if (this.state.num >= this.props.results.length) return null;

    const result = this.props.results[this.state.num];
    return (
      <div className="resultList">
        <motion.div
          className="resultItem"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
          <Bluffer index={this.state.num} name={this.blufferHeader(result.names)} isTruth={result.names === undefined} />
          <div className="resultTile">
            <span>{result.bluff}</span>
          </div>
          <div className="resultDupes">
            {result.duped.map((dupedName, dupedIndex) => {
              return (
                <Duped index={dupedIndex} name={dupedName} />
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }
};

export default Results;