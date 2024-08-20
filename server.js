require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

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
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
  } catch (error) {}
});

app.get("/register", (req, res) => {
  return res.status(200).render("register");
});

app.post("/register", async (req, res) => {
  try {
    const { name, username, password, phone, email } = req.body;
    if (!username || !name || !email || !phone || !password) {
      res.status(305).send({ message: "Invalid Credentials..." });
    }
    const hashedPassword = await bcrypt.hash(password, 13);
    const newUser = new User({
      username,
      password: hashedPassword,
      phone,
      email,
      name,
    });
    const user = await newUser.save();
    res.status(200).send({ message: "Account Created", user });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
