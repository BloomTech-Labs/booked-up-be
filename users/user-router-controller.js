const Agents = require("../agents/agent-model.js");
const Users = require("./user-model.js");
const bcrypt = require("bcryptjs");

// GET all users

exports.getAllUsers = [
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

// GET user by id

exports.getUserById = [
  (req, res) => {
    Users.findById(req.params.id).then((user) => {
      if (user.user_type !== "agent") {
        res.status(200).json({ user });
      } else {
        Users.findAgentInfoId(req.params.id)
          .then((agentInfo) => {
            const infoList = agentInfo.map((info) => {
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
            res.status(200).json({
              User: user,
              AgentInfo: infoList,
            });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      }
    });
  },
];

// UPDATE user

exports.updateUser = [
  (req, res) => {
    const updateUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      user_type: req.body.user_type,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      avatar_url: req.body.avatar_url,
    };
    Users.update(req.params.id, updateUser)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

// UPDATE email

exports.updateEmail = [
  (req, res) => {
    const updateUser = {
      email: req.body.email,
    };
    Users.update(req.params.id, updateUser)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

// UPDATE display name

exports.updateDisplayName = [
  (req, res) => {
    const updateUser = {
      display_name: req.body.display_name,
    };
    Users.update(req.params.id, updateUser)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

// UPDATE password

exports.updatePassword = [
  (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 12);
    const updatePass = {
      password: hash,
    };
    Users.update(req.params.id, updatePass)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

// DELETE user

exports.deleteUser = [
  (req, res) => {
    Users.removeUser(req.params.id)
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

// GET Agent Info by Id

exports.agentInfoById = [
  (req, res) => {
    Agents.findById(req.params.id)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

// POST Agent Info

exports.postAgentInfo = [
  (req, res) => {
    const agentInfo = {
      user_id: req.params.id,
      agent_type: req.body.agent_type,
      agency_name: req.body.agency_name,
      agency_address: req.body.agency_address,
      agency_phone_number: req.body.agency_phone_number,
      agency_email: req.body.agency_email,
    };
    Agents.add(agentInfo)
      .then((agent) => {
        res.status(200).json(agent);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

// UPDATE Agent Info

exports.updateAgentInfo = [
  (req, res) => {
    const updateAgentInfo = {
      agent_type: req.body.agent_type,
      agency_name: req.body.agency_name,
      agency_address: req.body.agency_address,
      agency_phone_number: req.body.agency_phone_number,
      agency_email: req.body.agency_email,
      user_id: req.params.id,
    };
    Agents.findByAgentInfoId(req.params.id).then((a) => {
      const agentInfoId = a.id;
      Agents.update(req.params.id, updateAgentInfo, agentInfoId)
        .then((agent) => {
          res.status(200).json(agent);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    });
  },
];
