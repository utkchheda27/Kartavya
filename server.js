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
  const tasks = await Task.find({ isCompleted: false }).sort({ order: 1 });
  res.render("inbox.ejs", { tasks });
});

app.get("/completed", async (req, res) => {
  const tasks = await Task.find({ isCompleted: true }).sort({ order: 1 });
  res.render("completed.ejs", { tasks });
});

app.get("/today", async (req, res) => {
  // Local midnight-to-midnight boundaries for "today"
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Local midnight
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  // Tasks due today
  const todayTasks = await Task.find({
    isCompleted: false,
    completionDate: { $gte: start, $lt: end },
  }).sort({ order: 1 });

  // Tasks overdue (due date before today, not completed)
  const overdueTasks = await Task.find({
    isCompleted: false,
    completionDate: { $lt: start },
  }).sort({ order: 1 });

  res.render("today.ejs", { todayTasks, overdueTasks });
});

app.get("/upcoming", async (req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // Tomorrow's midnight
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8); // Midnight 7 days after tomorrow

  const upcomingTasks = await Task.find({
    isCompleted: false,
    completionDate: { $gte: start, $lt: end },
  }).sort({ order: 1 });

  res.render("upcoming.ejs", { upcomingTasks });
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

app.patch("/tasks/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        isCompleted: true,
        taskCompletedDate: new Date(),
      },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(updatedTask);
  } catch (err) {
    console.log("Update error");
    console.error(err);
    res.status(500).json({ error: "Failed to complete task" });
  }
});

app.post("/tasks/reorder", async (req, res) => {
  try {
    const { ids } = req.body; // expecting an array of task _id strings in new order
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Update each task's order field according to its index in the array
    for (let i = 0; i < ids.length; i++) {
      await Task.findByIdAndUpdate(ids[i], { order: i });
    }

    res.json({ message: "Order updated successfully" });
  } catch (err) {
    console.error("Failed to update task order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
