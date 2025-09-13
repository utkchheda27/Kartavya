const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  description: String,
  priority: Number,
  completionDate: Date,
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);
