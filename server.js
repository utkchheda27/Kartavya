const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const expressSession = require("express-session");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

const Task = require("./models/taskSchema");
const User = require("./models/userSchema");

const { initializingPassport, isAuthenticated } = require("./passportConfig");

initializingPassport(passport);

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

//passport js middleware
app.use(
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 7 * 24 * 1000 * 60 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Pass the error to the next middleware
    }
    res.redirect("/login");
  });
});

//don't mix up authenticating and saving a new user to db
//use passport logic only for authentication
app.post("/register", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.send("User already exists");
    }

    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      password: req.body.password,
    });
    await newUser.save();

    // After successful registration, log the user in
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  } catch (err) {
    next(err);
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

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
