require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { model, Schema } = require("mongoose");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SEC,
    resave: false,
    saveUninitialized: false,
  })
);

mongoose.set("strictQuery", true);
mongoose
  .connect(
    process.env.NODE_ENV === "development"
      ? process.env.MONGO_URI_LOCAL
      : process.env.MONGO_URI_PUBLIC,
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.error(err));

const UserSchema = new Schema(
  {
    name: { type: String, },
    email: { type: String,  unique: true },
    username: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: { type: String,  },
  },
  { timestamps: true },
);

const User = model("User", UserSchema);
app.get("/", (req, res) => {
  return res.status(200).render("index");
});

app.get("/contact", (req, res) => {
  return res.status(200).render("contact");
});

app.get("/plans", (req, res) => {
  return res.status(200).render("plans");
});

app.get("/login", (req, res) => {
  return res.status(200).render("login");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Credentials required..." });
    }
    
     const user = await User.findOne({ email: email })
    
    if (!user) {
      return res.status(404).send({ message: "User not found..." });
    }

    if (password !== user.password) {
      return res.status(401).send({ message: "Invalid Credentials..." });
    }

    req.session.userId = user._id;

    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send({ message: "Error: " + error.message });
  }
});

app.get("/dashboard", (req, res) => {
  if (req.session.userId) {
    return res.status(200).render("dashboard");
  } else {
    return res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  return res.status(200).render("register");
});

app.post("/register", async (req, res) => {
  try {
    const { name, username, password, phone, email } = req.body;
    if (!username || !name || !email || !phone || !password) {
      res.status(400).send({ message: "Invalid Credentials..." });
    }

    const newUser = new User({ username, phone, email, name,password });
    const user = await newUser.save();
    res.status(200).send({ message: "Account Created" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
