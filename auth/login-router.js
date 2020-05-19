
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult, body } = require("express-validator");
const Users = require("../users/user-model.js");


// Login using email or display_name

router.post(
  "/",
  [
    body("login").custom((value, { req, loc, path }) => {
      if (value.indexOf("@") !== -1) {
        return Users.findByEmail(value).then((user) => {
          const newUser = user.map((u) => u.email_verification);
          if (
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ===
            false
          ) {
            return Promise.reject("please input a valid email");
          }
          if (user.length === 0) {
            return Promise.reject("email not registered");
          }
          if (newUser[0] === false) {
            return Promise.reject("email has not been validated");
          }
        });
      }
      return Users.findByDisplayName(value).then((user) => {
        const displayUser = user.map((u) => u.email_verification);
        if (value.length === 0) {
          return Promise.reject("login field required");
        }
        if (/\s/.test(value) === true) {
          return Promise.reject("please enter a valid display name");
        }
        if (user.length === 0) {
          return Promise.reject("display name not registered");
        }
        if (displayUser[0] === false) {
          return Promise.reject("user has not been validated");
        }
      });
    }),
    check("password", "password field is required").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
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
                const { title, content_url, created_at, last_updated } = info;
                return {
                  title,
                  content_url,
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
                Users.findByIdAuthorContent(u.id)
                  .then((authorContent) => {
                    const authorContentList = authorContent.map((info) => {
                      const {
                        title,
                        content_url,
                        created_at,
                        last_updated,
                      } = info;
                      return {
                        title,
                        content_url,
                        created_at,
                        last_updated,
                      };
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
            res.status().json({ message: "Invalid Credentials" });
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
                const { title, content_url, created_at, last_updated } = info;
                return {
                  title,
                  content_url,
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
                Users.findByIdAuthorContent(u.id)
                  .then((authorContent) => {
                    const authorContentList = authorContent.map((info) => {
                      const {
                        title,
                        content_url,
                        created_at,
                        last_updated,
                      } = info;
                      return {
                        title,
                        content_url,
                        created_at,
                        last_updated,
                      };
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
            res.status().json({ message: "Invalid Credentials" });
          }
        });
    }
  }
);

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

module.exports = router;
