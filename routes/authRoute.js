const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");

router.route("/signup").post(authController.signup);
router.route("/signin").post(authController.signin);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword").post(authController.restPassword);

module.exports = router;
