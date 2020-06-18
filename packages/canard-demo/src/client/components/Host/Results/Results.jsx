import React, { Component } from "react";
import { motion } from "framer-motion"
import "./Results.css";

const RESPONSE_TIME = 5;

class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      num: 0
    };
  }

  async componentDidMount() {
    setTimeout(() => {
      this.setState({ num: this.state.num + 1 })
    }, RESPONSE_TIME * 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.num >= this.props.results.length && prevProps === this.props) {
      this.props.canard.triggerScores({ roomId: this.props.room.roomId });
    }
    else if (prevState !== this.state) {
      setTimeout(() => {
        this.setState({ num: this.state.num + 1 })
      }, RESPONSE_TIME * 1000);
    }
  }

  render() {
    return (
      <div className="hostGame results" >
        <div className="resultList">
          {this.props.results.map((value, index) => {
            return (
              <div key={index}>
                {this.state.num === index && (
                  <motion.div
                    className="resultItem"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
                    <div className="resultNames">
                      <span>{value.names !== undefined ? 
                              value.names.join(" and ").concat("'s Lie!") : "The Truth!"}</span>
                    </div>
                    <div className="resultTile">
                      <span>{value.bluff}</span>
                    </div>
                    <div className="resultDupes">
                      {value.duped.map((dupedValue, dupedIndex) => {
                        return (
                          <div className="resultDupe" key={dupedIndex}>
                            <span>{dupedValue}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default Results;