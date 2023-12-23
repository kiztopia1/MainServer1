// Add Express
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
var fs = require("fs");
var path = require("path");
const cors = require("cors");
// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");
const User = require("./models/User");
const Email = require("./models/Email");
const Report = require("./models/Report");
const Goal = require("./models/Goal");

const secretKey =
  "5172112e-efd8-41da-ad4a-f5a8b9e900f15172112e-efd8-41da-ad4a-f5a8b9e900f1";
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// body parser for the post requests
app.use(bodyParser.urlencoded({ extended: true }));
const session = require("express-session");
const passport = require("passport");
const auth = require("./auth");
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token is not valid" });
    }

    // Use the decoded username to fetch the user from the database
    const { username } = decoded;
    User.findOne({ username }, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching user" });
      }
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!user.active) {
        return res.status(404).json({ error: "User is not active" });
      }

      // Attach the user to req.user with all details
      req.user = user;
      next();
    });
  });
}

async function connect() {
  await mongoose
    .connect(
      "mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority"
    )
    .then((dbRes) => {});
}
// connect();

mongoose.connect(
  "mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority"
);
// Handle connection errors
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Routes //

app.post("/login", (req, res, next) => {
  console.log("Attempting to login:", req.body.email, req.body.password);
  passport.authenticate("local", (err, user, info) => {
    console.log("Authenticate callback:", err, user, info);
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "Authentication failed." });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.json({ success: "Login successful.", user });
    });
  })(req, res, next);
});

app.post("/reg", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Create a new user with the generated token
    const user = new User({ email, password });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.post("/goal", async (req, res) => {
  try {
    const { email, goals, future } = req.body;

    // Create a new user with the generated token
    const goal = new Goal({ username, goal, future });

    // Save the user to the database
    await goal.save();

    res.status(201).json({ message: "Goal saved" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.post("/email", async (req, res) => {
  try {
    const { email, username } = req.body;

    // Create a new user with the generated token
    const user = new Email({ email, username });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "Email is added" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
// get current game id
// Define the time when the game starts (7 am)
const startTime = new Date();
startTime.setHours(7, 0, 0, 0);

// Define the game duration (3 minutes)
const gameDurationInMilliseconds = 3 * 60 * 1000;

// Define the starting game ID
let gameID = 1;

// Endpoint to check if a user is simply active
app.get("/statusCheck", verifyToken, (req, res) => {
  res.json({ status: req.user.active });
});

// a route the will check if there is preselected game and display that
app.get("/getPre", verifyToken, async (req, res) => {
  let preSet = req.user.preSet;
  if (preSet.length == 20) {
    const numberArray = preSet.map((str) => parseInt(str, 10));
    const user = await User.findOne({
      user: req.user._id,
    });
    user.preSet = [];
    user.save();
    res.json({ data: numberArray });
  } else {
    res.json({ data: null });
  }
});

// add preset
app.post("/setPre", verifyToken, async (req, res) => {
  const user = await User.findOne({
    user: req.user._id,
  });
  numbers = req.body.pre.split("-");
  user.preSet = numbers;
  console.log(user);
  user.save();
  if (numbers.length == 20) {
    res.json({ data: user.preSet });
  } else {
    res.json({ data: null });
  }
});
// register new user (betHouse)
app.post("/register", async (req, res) => {
  try {
    const { name } = req.body;

    // Generate a unique token for the user
    const token = jwt.sign({ name }, secretKey);
    console.log(token);

    // Create a new user with the generated token
    const user = new User({ name, token });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// register new user (betHouse)
app.get("/addReport", verifyToken, async (req, res) => {
  try {
    const net = req.query.net;

    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let data = {
      net: net,
      user: req.user._id,
    };
    console.log(data);
    let existingReport = await Report.findOne({
      user: req.user._id,
      createdAt: today,
    });

    if (existingReport == null) {
      // create a new one
      const report = new Report(data);
      // Save the user to the database
      await report.save();
    } else {
      existingReport.tickets = 0;
      existingReport.ticketMoney = 0;
      existingReport.redeemedMoney = 0;
      existingReport.save();
    }

    // Create a new user with the generated token

    res.status(201).json({ message: "Report created successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});
