const mongoose = require("mongoose");

const User = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  policyAccepted: {
    type: Boolean,
    default: false,
  },
  bio: { type: String, default: "No bio." },
  visibility: { type: String, default: "public" },

  links: {
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  acceptedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", User);
