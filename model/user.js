const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  avatar: {
    type: String,
  }
});

module.exports = mongoose.model("User", userSchema);
