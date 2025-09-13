const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    tasks:{
        type: Schema.Types.ObjectId,
        ref: "Task",
    }
});

module.exports = mongoose.model("User", userSchema);
