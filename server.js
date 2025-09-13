const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const Task = require("./models/taskSchema");

// 'mongodb://localhost:27017/yelp-camp'
mongoose.connect("mongodb://localhost:27017/Kartavya");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error!"));
db.once("open", () => {
  console.log("Database Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/inbox", async (req, res) => {
  const tasks = await Task.find({ isCompleted: false });
  res.render("inbox.ejs", { tasks });
});

app.get("/completed", async (req, res) => {
  const tasks = await Task.find({ isCompleted: true });
  res.render("completed.ejs", { tasks });
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
