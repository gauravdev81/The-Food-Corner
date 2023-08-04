const express = require("express");
const router = express.Router();
const User = require("../models/User");

const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const jwtSecret = "MynameisGauravDev";

router.post(
  "/createuser",
  [
    body("email", "Incorrect email").isEmail(),
    body("name", "Incorrect name").isLength({ min: 5 }),
    body("password", "Incorrect name").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);

    try {
      await User.create({
        name: req.body.name,
        location: req.body.location,
        email: req.body.email,
        password: secPassword,
      });
      res.json({ success: true });
    } catch (error) {
      console.log(error);

      res.json({ success: false });
    }
  }
);

//creating another routes for login credentials
//here we will try to find the logged in credentials in the login page
//with the credentials already present in our database.

router.post(
  "/loginuser",
  [
    body("email").isEmail(),

    body("password", "Incorrect password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let email = req.body.email;

    try {
      let userData = await User.findOne({ email });

      if (!userData) {
        return res
          .status(400)
          .json({ errors: "Try logging using correct email" });
      }

      const pswdCompare = await bcrypt.compare(
        req.body.password,
        userData.password
      );

      if (!pswdCompare) {
        return res
          .status(400)
          .json({ errors: "Try logging using correct password" });
      }

      const data = {
        user: {
          id: userData.id,
        },
      };

      const authToken = jwt.sign(data, jwtSecret);

      



      return res.json({ success: true, authToken: authToken });
    } catch (error) {
      console.log(error);

      res.json({ success: false });
    }
  }
);

module.exports = router;
