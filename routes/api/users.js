const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const authenticatedOnly = require("../auth");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role ? req.body.role : "User"
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          role: user.role
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.get("/", authenticatedOnly, (req, res) => {
  User.find({}, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/create", authenticatedOnly, (req, res) => {
  if (req.user.role !== "Super Admin")
    return res.status(404).send("Super Admin Only.");

  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role ? req.body.role : "User"
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.json({user: user._doc, success: "User successfully created."})
            }).catch(err => console.log(err));
        });
      });
    }
  });
});

router.put("/update", authenticatedOnly, (req, res) => {
  if (req.user.role !== "Super Admin")
    return res.status(404).send("Super Admin Only.");

  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ _id : { $ne: require('mongodb').ObjectId(req.body._id) }, email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUserData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      };

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUserData.password, salt, (err, hash) => {
          if (err) throw err;
          newUserData.password = hash;
          User.updateOne({ _id: require('mongodb').ObjectId(req.body._id) }, newUserData, (err, result) => {
            if (err) throw err;
            res.json({user: {_id: req.body._id, ...newUserData}, success: "User successfully updated."});
          });
        });
      });
    }
  });
});

router.post('/delete', authenticatedOnly, (req, res) => {
  if (req.user.role === "Super Admin") {
    User.deleteOne({ _id: require('mongodb').ObjectId(req.body._id) }, (err, result) => {
      if (err) throw err;
      res.json({success: "User successfully deleted."});
    });
  }
});

router.get("/user-count", authenticatedOnly, (req, res) => {
  today = new Date();
  User.aggregate([
    {$project: {year: { $year: "$date" }, month: {$month: "$date"}, day: { $dayOfMonth: "$date" }}},
    {$match: {year: today.getFullYear(), month: today.getMonth() + 1}},
    {$group: { _id: "$day", count: { $sum: 1 } }},
    {$sort: {"date": 1}}
  ]).then(result => {
    res.json(result);
  });
});

module.exports = router;
