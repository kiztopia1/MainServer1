const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportScheme = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tickets: Number,
    ticketMoney: Number,
    redeemedMoney: Number,
    net: Number,
    createdAt: {
      type: Date,
      default: function () {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set time to the beginning of the day
        return currentDate;
      },
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportScheme);
module.exports = Report;
