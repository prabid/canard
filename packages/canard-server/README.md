# `canard-server`

A deception-based multiplayer game - server component.

## Usage

```javascript
const canard = require("canard-server");
```

### Using Express

```javascript
const express = require("express");
const path = require("path");
const canard = require("canard-server");
const gameReference = require("./gameReference");

const port = process.env.PORT || 8080;
const app = express();
app.use(express.static("build"));

app.get("/", function(req, res) {
  res.sendFile(path.join("build", "index.html"));
});

canard({ app, port }, gameReference);
```

### Game Reference

```javascript
module.exports = {
  gameTypes: ["demo"],
  demo: {
    gameLength: 60000,
    validActionIds: [0, 1],
    description: `This is the description of the game. You have 60 seconds to compete`
  },
  actions: {
    0: { actionName: "action1" },
    1: { actionName: "action2" }
  }
};
```
