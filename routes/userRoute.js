const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
router
  .route("/updatePassword")
  .patch(authController.protect, userController.updatePassword);

router.patch("/updateMe", authController.protect, userController.updateMe);

router
  .route("/deleteMe")
  .delete(authController.protect, userController.deleteMe);

router.get("/getAllUsers", authController.protect, userController.getAllUsers);

module.exports = router;
