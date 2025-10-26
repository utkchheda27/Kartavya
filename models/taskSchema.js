const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  description: String,
  details: String,
  priority: Number,
  completionDate: Date,
  taskCompletedDate: Date,
  isCompleted: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Task", taskSchema);
