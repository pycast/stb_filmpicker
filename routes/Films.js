const express = require("express");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bp = require('body-parser');

// parse application/x-www-form-urlencoded
router.use(bp.urlencoded({ extended: false }))
// parse application/json
router.use(bp.json())

let db = new sqlite3.Database('movies.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the movies database.');
});

db.run(`CREATE TABLE IF NOT EXISTS movies (
  movie_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  stb_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (stb_id) REFERENCES stbpotes(stb_id),
  FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
)`);

db.run(
  `CREATE TABLE IF NOT EXISTS stbpotes(
  stb_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE
)`);

db.run(`CREATE TABLE IF NOT EXISTS tags (
  tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
  genre TEXT UNIQUE
)`);

const allMovies = "SELECT * FROM movies";
let movies = [];

const allgens = "SELECT * FROM stbpotes";
let peoples = [];

const alltags = "SELECT * FROM tags";
let tags = [];

db.all(allMovies, [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  movies = rows;
  console.log(movies);
});

db.all(allgens, [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  peoples = rows;
});

db.all(alltags, [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  tags = rows;
});

router.get("/", (req, res) => {
  db.all(allMovies, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    movies = rows;
  });
  res.render("films.ejs", { movies: movies, peoples: peoples, tags: tags});
});

router.get("/new", (req, res) => {
  res.render("newFilm.ejs", { peoples: peoples, tags: tags});
});

router.post('/addFilm', (req, res) => {
  const sql = `INSERT INTO movies (title, stb_id, tag_id) VALUES (?, ?, ?)`;
  db.run(sql, [req.body.title, req.body.stbperson, req.body.genre], (err) => {
    if (err) {
      console.error(err.message);
    }
      console.log("Nouvelle ligne!");
    } );
  res.render("films.ejs", { movies: movies, peoples: peoples, tags: tags});
  console.log(movies);
})

router.post('/addgenre', (req, res) => {
  const sql = `INSERT INTO tags (genre) VALUES (?)`;
  db.run(sql, [req.body.genre], (err) => {
    if (err) {
      console.error(err.message);
    }
      console.log("Nouvelle ligne!");
    } );
    res.render("newFilm.ejs", { peoples: peoples, tags: tags});
})

router.post('/addstb', (req, res) => {
  const sql = `INSERT INTO stbpotes (name) VALUES (?)`;
  db.run(sql, [req.body.stb], (err) => {
    if (err) {
      console.error(err.message);
    }
      console.log("Nouvelle ligne!");
    } );
    res.render("newFilm.ejs", { peoples: peoples, tags: tags});
})

router.get("/tirajosaure", (req, res) => {
  res.render("tirajosaure.ejs", { peoples: peoples, tags: tags});
});

// const sql = `DELETE FROM movies WHERE title = "Fight Club =))"`;

// db.run(sql, [], (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//     console.log("Nouvelle ligne!");
//   } );

// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });

module.exports = router ;