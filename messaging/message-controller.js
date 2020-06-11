const Messages = require("./message-model.js");
const MessageInbox = require("./message-inbox-model.js");
const MessageReply = require("./message-reply-model");
const Users = require("../users/user-model");

// POST message

exports.postMessage = [
  (req, res) => {
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
  },
];

// Post message reply

exports.postMessageReply = [
  (req, res) => {
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
  },
];

// Get all messages-inbox by User ID

exports.messageInboxUserId = [
  (req, res) => {
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
  },
];

// Get message by message ID

exports.messageByMessageId = [
  (req, res) => {
    MessageInbox.findByMessageId(req.params.messageId)
      .then((message) => {
        res.status(200).json({
          Message: message,
        });
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

// Get message by message ID and show all responses

exports.messageByMessageIdResponses = [
  (req, res) => {
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
  },
];

// Get sent messages by User ID

exports.sentMessagesByUserId = [
  (req, res) => {
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
  },
];

// Get recieved messages by user ID

exports.recievedMessagesByUserId = [
  (req, res) => {
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
  },
];

// Get messages by sent id and recieved id

exports.messagesSentIdRecievedId = [
  (req, res) => {
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
  },
];

// Get all message subjects by User ID

exports.messageSubjectsUserId = [
  (req, res) => {
    MessageInbox.findByIdSubject(req.params.id)
      .then((message) => {
        res.status(200).json({
          Message: message,
        });
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

// Get sent subject by User ID

exports.sentSubjectUserId = [
  (req, res) => {
    MessageInbox.findByIdSentSubject(req.params.id)
      .then((message) => {
        res.status(200).json({
          Message: message,
        });
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

// Get recieved subject by User ID

exports.recievedSubjectUserId = [
  (req, res) => {
    MessageInbox.findByIdRecievedSubject(req.params.id)
      .then((message) => {
        res.status(200).json({
          Message: message,
        });
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

// Delete message

exports.deleteMessage = [
  (req, res) => {
    MessageInbox.removeMessage(req.params.id).then((post) => {
      MessageReply.removeMessage(req.params.id)
        .then((mssg) => {
          res.status(200).json(post);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    });
  },
];
