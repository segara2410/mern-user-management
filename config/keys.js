require('dotenv').config()

module.exports = {
  mongoURI: process.env.mongoURI,
  secretOrKey: process.env.secretOrKey
};
