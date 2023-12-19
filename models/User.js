const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const userScheme = new Schema(
  {
    email: {
      type: String,
      required: false,
    },
    username: { type: String },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
userScheme.plugin(passportLocalMongoose);
const User = mongoose.model("User", userScheme);
module.exports = User;
