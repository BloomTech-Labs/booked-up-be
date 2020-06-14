const router = require("express").Router();

const registerRouter = require("../auth/register-router");
const loginRouter = require("../auth/login-router");
const usersRouter = require("../users/user-router");
const contentRouter = require("../author-content/content-router");
const libraryRouter = require("../content-library/library-router");
const adminRegisterRouter = require("../auth/admin-register-router");
const adminLoginRouter = require("../auth/admin-login-router");
const adminRouter = require("../admins/admin-router");
const userResetPassword = require("../users/user-reset-password");
const messageRouter = require("../messaging/message-router");
const commentsRouter = require("../comments/comments-router");

router.use("/auth/register", registerRouter);
router.use("/auth/login", loginRouter);
router.use("/users", usersRouter);
router.use("/author-content", contentRouter);
router.use("/content-library", libraryRouter);
router.use("/auth/admin/register", adminRegisterRouter);
router.use("/auth/admin/login", adminLoginRouter);
router.use("/admin", adminRouter);
router.use("/users/password", userResetPassword);
router.use("/message/", messageRouter);
router.use("/comments", commentsRouter);

module.exports = router;
