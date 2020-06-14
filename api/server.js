const express = require("express");
const bookedUpRouter = require("./api-router.js");
const configureMiddleware = require("./configure-middleware.js");

const server = express();

configureMiddleware(server);

server.use("/api", bookedUpRouter);

server.get("/", (req, res) => {
  res.status(200).json({
    api: "Booked Up server live.",
  });
});

module.exports = server;
