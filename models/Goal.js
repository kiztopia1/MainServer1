const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goalSchema = new Schema(
  {
    goals: {
      type: String,
      required: false,
    },
    username: { type: String },
    future: { type: String },
  },
  { timestamps: true }
);

const Goal = mongoose.model("Goal", goalSchema);
module.exports = Goal;