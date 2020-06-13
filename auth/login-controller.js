const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/user-model.js");
const Genres = require("../author-content/genres-model");

exports.postLogin = [
  (req, res) => {
    const { email, password } = req.body;
    if (req.body.login.indexOf("@") !== -1) {
      Users.findByEmail(req.body.login)
        .first()
        .then((u) => {
          if (u && bcrypt.compareSync(password, u.password)) {
            const token = genToken(u);

            const userList = {
              id: u.id,
              userType: u.user_type,
              firstName: u.first_name,
              lastName: u.last_name,
              displayName: u.display_name,
              email: u.email,
              country: u.country,
              state: u.state,
              city: u.city,
              image: u.image,
              createdAt: u.created_at,
            };

            Users.findByIdContentLibrary(u.id).then((content) => {
              const contentLibraryList = content.map((info) => {
                const {
                  author_content_id,
                  title,
                  content_url,
                  created_at,
                  last_updated,
                  description,
                  img_url,
                } = info;
                return {
                  author_content_id,
                  title,
                  content_url,
                  description,
                  img_url,
                  created_at,
                  last_updated,
                };
              });
              Users.findAgentInfoId(u.id).then((agentInfo) => {
                const agentInfoList = agentInfo.map((info) => {
                  const {
                    agent_type,
                    agency_type,
                    agency_address,
                    agency_phone_number,
                    agency_email,
                  } = info;
                  return {
                    agent_type,
                    agency_type,
                    agency_address,
                    agency_phone_number,
                    agency_email,
                  };
                });
                Genres.findById(u.id)
                  .then((content) => {
                    const contentGenre = content.map((ele) => {
                      const genres = [];
                      const objectArray = Object.entries(ele);
                      objectArray.map(([key, value]) => {
                        if (value === true) {
                          return genres.push(key);
                        }
                      });
                      const {
                        id,
                        user_id,
                        title,
                        description,
                        img_url,
                        content_url,
                        created_at,
                        last_updated,
                        public_id,
                      } = ele;
                      const newObj = {
                        id,
                        user_id,
                        title,
                        description,
                        img_url,
                        content_url,
                        created_at,
                        last_updated,
                        public_id,
                        genres,
                      };
                      return newObj;
                    });
                    if (u.user_type === "author") {
                      res.status(200).json({
                        User: userList,
                        AuthorContent: contentGenre,
                        ContentLibrary: contentLibraryList,
                        Token: token,
                      });
                    } else if (u.user_type === "agent") {
                      res.status(200).json({
                        User: userList,
                        AgentInfo: agentInfoList,
                        contentLibrary: contentLibraryList,
                        Token: token,
                      });
                    } else {
                      res.status(200).json({
                        User: userList,
                        contentLibrary: contentLibraryList,
                        Token: token,
                      });
                    }
                  })
                  .catch((err) => {
                    res.status(500).json(err);
                  });
              });
            });
          } else {
            res.status(400).json({ message: "Invalid Credentials" });
          }
        });
    } else {
      Users.findByDisplayName(req.body.login)
        .first()
        .then((u) => {
          if (u && bcrypt.compareSync(password, u.password)) {
            const token = genToken(u);

            const userList = {
              id: u.id,
              userType: u.user_type,
              firstName: u.first_name,
              lastName: u.last_name,
              displayName: u.display_name,
              email: u.email,
              country: u.country,
              state: u.state,
              city: u.city,
              image: u.image,
              createdAt: u.created_at,
            };

            Users.findByIdContentLibrary(u.id).then((content) => {
              const contentLibraryList = content.map((info) => {
                const {
                  author_content_id,
                  title,
                  content_url,
                  created_at,
                  last_updated,
                  description,
                  img_url,
                } = info;
                return {
                  author_content_id,
                  title,
                  content_url,
                  description,
                  img_url,
                  created_at,
                  last_updated,
                };
              });
              Users.findAgentInfoId(u.id).then((agentInfo) => {
                const agentInfoList = agentInfo.map((info) => {
                  const {
                    agent_type,
                    agency_type,
                    agency_address,
                    agency_phone_number,
                    agency_email,
                  } = info;
                  return {
                    agent_type,
                    agency_type,
                    agency_address,
                    agency_phone_number,
                    agency_email,
                  };
                });
                Genres.findById(u.id)
                  .then((content) => {
                    const contentGenre = content.map((ele) => {
                      const genres = [];
                      const objectArray = Object.entries(ele);
                      objectArray.map(([key, value]) => {
                        if (value === true) {
                          return genres.push(key);
                        }
                      });
                      const {
                        id,
                        user_id,
                        title,
                        description,
                        img_url,
                        content_url,
                        created_at,
                        last_updated,
                        public_id,
                      } = ele;
                      const newObj = {
                        id,
                        user_id,
                        title,
                        description,
                        img_url,
                        content_url,
                        created_at,
                        last_updated,
                        public_id,
                        genres,
                      };
                      return newObj;
                    });
                    if (u.user_type === "author") {
                      res.status(200).json({
                        User: userList,
                        AuthorContent: authorContentList,
                        ContentLibrary: contentLibraryList,
                        Token: token,
                      });
                    } else if (u.user_type === "agent") {
                      res.status(200).json({
                        User: userList,
                        AgentInfo: agentInfoList,
                        contentLibrary: contentLibraryList,
                        Token: token,
                      });
                    } else {
                      res.status(200).json({
                        User: userList,
                        contentLibrary: contentLibraryList,
                        Token: token,
                      });
                    }
                  })
                  .catch((err) => {
                    res.status(500).json(err);
                  });
              });
            });
          } else {
            res.status(400).json({ message: "Invalid Credentials" });
          }
        });
    }
  },
];

function genToken(user) {
  const payload = {
    userid: user.id,
    userType: [`${user.user_type}`],
  };

  const options = {
    expiresIn: "8h",
  };

  const token = jwt.sign(payload, secrets.jwtSecret, options);

  return token;
}
