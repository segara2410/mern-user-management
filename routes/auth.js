const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = function(req, res, next) {
  var token = req.headers['x-access-token'];

  if (!token) return res.status(401).send('No token provided.');
  
  jwt.verify(token, keys.secretOrKey, function(err, decoded) {
    if (err) return res.status(500).send('Failed to authenticate token.');
    
    User.findById(decoded.id, 
      { password: 0 }, // projection
      function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        req.user = user;
        next();
      }
    );
  });
}