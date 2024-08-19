require("dotenv").config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res) => {
  return res.status(200).render("index");
});

app.get("/contact",(req,res) => {
  return res.status(200).render("contact");
});

app.get("/plans",(req,res) => {
  return res.status(200).render("plans");
});

app.get("/login",(req,res) => {
  return res.status(200).render("login");
});

app.get("/register",(req,res) => {
  return res.status(200).render("register");
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})