const router = require("express").Router();

const {
  validateMessageSend,
  validateMessageReply,
  validateUserId,
  validateMessageByMessageId,
  validateMessageInboxId,
  sentIdRecievedId,
} = require("./message-validations");

const {
  postMessage,
  postMessageReply,
  messageInboxUserId,
  messageByMessageId,
  messageByMessageIdResponses,
  sentMessagesByUserId,
  recievedMessagesByUserId,
  messagesSentIdRecievedId,
  messageSubjectsUserId,
  sentSubjectUserId,
  recievedSubjectUserId,
  deleteMessage,
} = require("./message-controller");

// POST message

router.post("/:id", validateMessageSend, postMessage);

// Post message reply

router.post("/:id/reply/:replyId", validateMessageReply, postMessageReply);

// Get all messages-inbox by User ID

router.get("/:id/inbox", validateUserId, messageInboxUserId);

// Get message by message ID

router.get(
  "/:id/inbox/:messageId",
  validateMessageByMessageId,
  messageByMessageId
);

// Get message by message ID and show all responses

router.get("/inbox/:id", validateMessageInboxId, messageByMessageIdResponses);

// Get sent messages by User ID

router.get("/:id/sent", validateUserId, sentMessagesByUserId);

// Get recieved messages by user ID

router.get("/:id/recieved", validateUserId, recievedMessagesByUserId);

// Get messages by sent id and recieved id

router.get("/:sentId/:recievedId", sentIdRecievedId, messagesSentIdRecievedId);

// Get all message subjects by User ID

router.get("/:id/subject/all", validateUserId, messageSubjectsUserId);

// Get sent subject by User ID

router.get("/:id/subject/sent", validateUserId, sentSubjectUserId);

// Get recieved subject by User ID

router.get("/:id/subject/recieved", validateUserId, recievedSubjectUserId);

// Delete message

router.delete("/:id/", validateMessageInboxId, deleteMessage);

module.exports = router;
