const express = require('express')
const app = express()
const path = require('path');
const ejs = require('ejs')
const port = 3000

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// routes

const homeRoute = require("./routes/Home");
const filmRoute = require("./routes/Films");
app.use("/", homeRoute);
app.use("/film", filmRoute);

// // database etc etc

// const sqlite3 = require('sqlite3').verbose();

// let db = new sqlite3.Database('movies.db', (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Connected to the movies database.');
// });

// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });