const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  profilePic: {
    data: Buffer,
    contentType: String,
  },
});

userSchema.plugin(passportLocalMongoose); // This manages password field and authentication

module.exports = mongoose.model("User", userSchema);
