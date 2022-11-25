require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");

const PORT = process.env.PORT || 3000;

// Database connection
const url = process.env.DB_URL;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("Database connection established");
  })
  .on("error", (err) => {
    console.error("Database connection error: " + err.message);
  });

// Session Store
let mongoStore = new MongoDbStore({
  mongoUrl: url,
  collection: "sessions",
});

// Session Configuration
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hour
  })
);

app.use(flash());

// Assets
app.use(express.static("public"));
app.use(express.json());

// Global Middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Set Template Engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Routes
require("./routes/web")(app);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
