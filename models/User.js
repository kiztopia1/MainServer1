const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScheme = new Schema(
  {
    token: {
      type: String,
      required: false,
    },
    name: {
      type: String,
    },
    preSet: {
      type: [String],
      required: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userScheme);
module.exports = User;
