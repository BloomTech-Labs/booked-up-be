const bcrypt = require("bcryptjs");
const Users = require("../users/user-model.js");
const Genres = require("../author-content/genres-model");
const Libraries = require("../content-library/library-model");

const { genToken } = require("./generate-token");

const LoginFuncDisplay = (req, res) => {
  const { email, password } = req.body;
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
        Libraries.findByIdLibrary(u.id).then((library) => {
          const libraryContent = library.map((ele) => {
            const genres = [];
            const objectArray = Object.entries(ele);
            objectArray.map(([key, value]) => {
              if (value === true && key !== "email_verification") {
                return genres.push(key);
              }
            });
            const {
              author_content_id,
              user_id,
              first_name,
              last_name,
              title,
              description,
              img_url,
              content_url,
              created_at,
              last_updated,
              public_id,
              img_public_id,
            } = ele;
            const newObj = {
              author_content_id,
              user_id,
              first_name,
              last_name,
              title,
              description,
              img_url,
              content_url,
              created_at,
              last_updated,
              public_id,
              img_public_id,
              genres,
            };
            return newObj;
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
                    if (value === true && key !== "email_verification") {
                      return genres.push(key);
                    }
                  });
                  const {
                    author_content_id,
                    user_id,
                    first_name,
                    last_name,
                    title,
                    description,
                    img_url,
                    content_url,
                    created_at,
                    last_updated,
                    public_id,
                  } = ele;
                  const newObj = {
                    author_content_id,
                    user_id,
                    first_name,
                    last_name,
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
                    ContentLibrary: libraryContent,
                    Token: token,
                  });
                } else if (u.user_type === "agent") {
                  res.status(200).json({
                    User: userList,
                    AgentInfo: agentInfoList,
                    ContentLibrary: libraryContent,
                    Token: token,
                  });
                } else {
                  res.status(200).json({
                    User: userList,
                    ContentLibrary: libraryContent,
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
};

const loginFuncEmail = (req, res) => {
  const { email, password } = req.body;
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
        Libraries.findByIdLibrary(u.id).then((library) => {
          const libraryContent = library.map((ele) => {
            const genres = [];
            const objectArray = Object.entries(ele);
            objectArray.map(([key, value]) => {
              if (value === true && key !== "email_verification") {
                return genres.push(key);
              }
            });
            const {
              author_content_id,
              user_id,
              first_name,
              last_name,
              title,
              description,
              img_url,
              content_url,
              created_at,
              last_updated,
              public_id,
            } = ele;
            const newObj = {
              author_content_id,
              user_id,
              first_name,
              last_name,
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
                    if (value === true && key !== "email_verification") {
                      return genres.push(key);
                    }
                  });
                  const {
                    author_content_id,
                    user_id,
                    first_name,
                    last_name,
                    title,
                    description,
                    img_url,
                    content_url,
                    created_at,
                    last_updated,
                    public_id,
                    img_public_id,
                  } = ele;
                  const newObj = {
                    author_content_id,
                    user_id,
                    first_name,
                    last_name,
                    title,
                    description,
                    img_url,
                    content_url,
                    created_at,
                    last_updated,
                    public_id,
                    img_public_id,
                    genres,
                  };
                  return newObj;
                });
                if (u.user_type === "author") {
                  res.status(200).json({
                    User: userList,
                    AuthorContent: contentGenre,
                    ContentLibrary: libraryContent,
                    Token: token,
                  });
                } else if (u.user_type === "agent") {
                  res.status(200).json({
                    User: userList,
                    AgentInfo: agentInfoList,
                    ContentLibrary: libraryContent,
                    Token: token,
                  });
                } else {
                  res.status(200).json({
                    User: userList,
                    ContentLibrary: libraryContent,
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
};

module.exports = {
  loginFuncEmail,
  LoginFuncDisplay,
};
