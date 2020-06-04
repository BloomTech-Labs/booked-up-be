const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

module.exports = (server) => {
  server.use("/public", express.static("public"));
  server.use(helmet());
  server.use(express.json());
  server.use(
    cors({
      origin: "*",
      methods: "GET, PUT, PATCH, POST, DELETE",
    })
  );
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(cookieParser(process.env.COOKIE_SECRET));
  server.use(
    session({
      cookie: { maxAge: 60000 },
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  server.use(flash());
};
