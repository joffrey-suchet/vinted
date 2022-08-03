const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//import du model User
const User = require("../models/User");

//route pour créer un compte
router.post("/user/signup", async (req, res) => {
  try {
    const isUserExisting = await User.findOne({
      email: req.body.email,
    });

    if (isUserExisting === null && req.body.username) {
      const salt = uid2(16);
      const hash = SHA256(req.body.password + salt).toString(encBase64);
      const token = uid2(32);
      console.log("salt==>", salt);
      console.log("hash==>", hash);

      const newUser = new User({
        email: req.body.email,
        account: {
          username: req.body.username,
        },
        newletter: req.body.newletter,
        token: token,
        salt: salt,
        hash: hash,
      });

      await newUser.save();
      console.log(newUser);
      res.json({
        _id: newUser._id,
        email: newUser.email,
        token: newUser.token,
        account: newUser.account,
      });
    } else if (req.body.username === undefined) {
      res.status(400).json({ message: "username missing" });
    } else if (isUserExisting !== null) {
      res.json({ message: "the mail already" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//route pour se connecter à un compte
router.post("/user/login", async (req, res) => {
  try {
    const userConnect = await User.findOne({ email: req.body.email });
    console.log("user=", userConnect);
    if (userConnect === null) {
      res.status(401).json({ message: "Unauthorized 1" });
    } else {
      const newHash = SHA256(req.body.password + userConnect.salt).toString(
        encBase64
      );
      console.log("newHash=>", newHash);
      console.log("hash=>", userConnect.hash);

      if (newHash === userConnect.hash) {
        res.json({
          _id: userConnect._id,
          token: userConnect.token,
          account: userConnect.account,
        });
      } else {
        res.status(401).json({ message: "unauthorized 2" });
      }
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
