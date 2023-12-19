const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const emailSchema = new Schema(
  {
    email: {
      type: String,
      required: false,
    },
    username: { type: String },
  },
  { timestamps: true }
);

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
