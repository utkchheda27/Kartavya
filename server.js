const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const Task = require("./models/taskSchema");

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
app.use(bodyParser.json()); //Middleware
app.use(express.urlencoded({ extended: true }));

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

app.post("/tasks/add", async (req, res) => {
  try {
    let { description, details, completionDate, priority } = req.body;
    if (!description || description.trim() === "") {
      return res.status(400).json({ error: "Task description is required" });
    }
    if (!completionDate) {
      const today = new Date();
      //add priority days to today's date if completion Date not given
      today.setDate(today.getDate() + Number(priority || 0));
      completionDate = today;
    }
    // Create and save task in MongoDB
    const newTask = new Task({
      description,
      details,
      completionDate,
      priority,
      isCompleted: false,
    });
    await newTask.save();
    res.redirect("/inbox");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add task" });
  }
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
