require("dotenv").config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.get("/",(req,res) => {
  return res.status(200).render("index");
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})