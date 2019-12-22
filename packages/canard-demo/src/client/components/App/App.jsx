import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Landing from "../Landing/Landing";
import Host from "../Host/Host";
import Player from "../Player/Player";
import Header from "../Header/Header";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/player" component={Player} />
          <Route exact path="/host" component={Host} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
