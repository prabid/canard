require('dotenv').config();

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
