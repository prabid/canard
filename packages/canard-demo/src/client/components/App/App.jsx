import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Host from "../Host/Host";
import Player from "../Player/Player";
import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Player} />
          <Route exact path="/host" component={Host} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
