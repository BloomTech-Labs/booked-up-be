const router = require("express").Router();
const { check, validationResult, body } = require("express-validator");
const Messages = require("./message-model.js");
const MessageInbox = require("./message-inbox-model.js");
const MessageReply = require("./message-reply-model");
const Users = require("../users/user-model");
const checkRole = require("../check-role/check-role-message.js");
const restricted = require("../auth/restricted");

const {
  validateMessageSend,
  validateMessageReply,
  validateUserId,
  validateMessageByMessageId,
  validateMessageInboxId,
  sentIdRecievedId,
} = require("./message-validations");

// POST message

router.post("/:id", validateMessageSend, (req, res) => {
  const newMessage = {
    subject: req.body.subject,
    body: req.body.body,
    sender_id: req.params.id,
    recipient_id: req.body.recipient_id,
    recipient: req.body.recipient,
  };
  Messages.add(newMessage).then((message) => {
    const newInbox = {
      user_id: req.params.id,
      recipient_id: req.body.recipient_id,
      message_id: message.id,
    };
    MessageInbox.add(newInbox)
      .then(() => {
        res.status(200).json(message);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  });
});

// Post message reply

router.post("/:id/reply/:replyId", validateMessageReply, (req, res) => {
  const newMessage = {
    subject: req.body.subject,
    body: req.body.body,
    sender_id: req.params.id,
    recipient_id: req.body.recipient_id,
    recipient: req.body.recipient,
    linking_id: req.params.replyId,
  };
  Messages.add(newMessage).then((message) => {
    const newInbox = {
      user_id: req.params.id,
      recipient_id: req.body.recipient_id,
      message_id: message.id,
    };
    const newReply = {
      user_id: req.params.id,
      recipient_id: req.body.recipient_id,
      message_id: message.id,
    };
    MessageInbox.add(newInbox).then(() => {
      MessageReply.add(newReply)
        .then(() => {
          console.log(newReply);
          res.status(200).json(message);
        })
        .catch((err) => {
          res.status(500).json(err.message);
        });
    });
  });
});

// Get all messages

router.get("/", restricted, checkRole(), (req, res) => {
  MessageInbox.findByIdSearch(req.params.id)
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// Get all messages-inbox by User ID

router.get("/:id/inbox", validateUserId, (req, res) => {
  const { body, sort, limit } = req.query;
  MessageInbox.findById(req.params.id, {
    body,
    sort,
    limit,
  })
    .then((messages) => {
      res.status(200).json({
        Messages: messages,
      });
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// Get message by message ID

router.get("/:id/inbox/:messageId", validateMessageByMessageId, (req, res) => {
  MessageInbox.findByMessageId(req.params.messageId)
    .then((message) => {
      res.status(200).json({
        Message: message,
      });
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// Get message by message ID and show all responses

router.get("/inbox/:id", validateMessageInboxId, (req, res) => {
  const { body, sort, limit } = req.query;
  MessageReply.findById(req.params.id, { body, sort, limit })
    .then((message) => {
      res.status(200).json({
        Messages: message,
      });
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// Get sent messages by User ID

router.get("/:id/sent", validateUserId, (req, res) => {
  const { body, sort, limit } = req.query;
  MessageInbox.findByIdSent(req.params.id, {
    body,
    sort,
    limit,
  })
    .then((messages) => {
      res.status(200).json({
        Messages: messages,
      });
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// Get recieved messages by user ID

router.get("/:id/recieved", validateUserId, (req, res) => {
  const { body, sort, limit } = req.query;
  MessageInbox.findByIdRecieved(req.params.id, {
    body,
    sort,
    limit,
  })
    .then((message) => {
      res.status(200).json({
        Message: message,
      });
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// Get messages by sent id and recieved id

router.get("/:sentId/:recievedId", sentIdRecievedId, (req, res) => {
  const { body, sort, limit } = req.query;
  MessageInbox.findByIdSentandRecieved(
    req.params.sentId,
    req.params.recievedId,
    { body, sort, limit }
  )
    .then((message) => {
      res.status(200).json({
        Message: message,
      });
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// Get all message subjects by User ID

router.get("/:id/subject/all", validateUserId, (req, res) => {
  MessageInbox.findByIdSubject(req.params.id)
    .then((message) => {
      res.status(200).json({
        Message: message,
      });
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// Get sent subject by User ID

router.get("/:id/subject/sent", validateUserId, (req, res) => {
  MessageInbox.findByIdSentSubject(req.params.id)
    .then((message) => {
      res.status(200).json({
        Message: message,
      });
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// Get recieved subject by User ID

router.get("/:id/subject/recieved", validateUserId, (req, res) => {
  MessageInbox.findByIdRecievedSubject(req.params.id)
    .then((message) => {
      res.status(200).json({
        Message: message,
      });
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// Delete message

router.delete("/:id/", validateMessageInboxId, (req, res) => {
  MessageInbox.removeMessage(req.params.id).then((post) => {
    MessageReply.removeMessage(req.params.id)
      .then((mssg) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
});

module.exports = router;
