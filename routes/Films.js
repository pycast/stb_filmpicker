const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const bp = require("body-parser");

// parse application/x-www-form-urlencoded
router.use(bp.urlencoded({ extended: false }));
// parse application/json
router.use(bp.json());

let db = new sqlite3.Database("movies.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the movies database.");
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
)`
);

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
  res.render("films.ejs", { movies: movies, peoples: peoples, tags: tags });
});

router.get("/new", (req, res) => {
  res.render("newFilm.ejs", { peoples: peoples, tags: tags });
});

router.post("/addFilm", (req, res) => {
  const sql = `INSERT INTO movies (title, stb_id, tag_id) VALUES (?, ?, ?)`;
  db.run(sql, [req.body.title, req.body.stbperson, req.body.genre], (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Nouvelle ligne!");
  });
  res.render("films.ejs", { movies: movies, peoples: peoples, tags: tags });
});

router.post("/addgenre", (req, res) => {
  const sql = `INSERT INTO tags (genre) VALUES (?)`;
  db.run(sql, [req.body.genre], (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Nouvelle ligne!");
  });
  res.render("newFilm.ejs", { peoples: peoples, tags: tags });
});

router.post("/addstb", (req, res) => {
  const sql = `INSERT INTO stbpotes (name) VALUES (?)`;
  db.run(sql, [req.body.stb], (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Nouvelle ligne!");
  });
  res.render("newFilm.ejs", { peoples: peoples, tags: tags });
});

router.get("/tirage", (req, res) => {
  res.render("tirage.ejs", { peoples: peoples, tags: tags });
});

let persons = "";
let genres = "";
let output = [];

router.post("/randomfilm", (req, res) => {
  for (let index = 0; index < req.body.stb.length; index++) {
    if (persons == "") {
      persons = persons + "(stb_id = " + req.body.stb[index] + ")";
    } else {
      persons = persons + " OR (stb_id = " + req.body.stb[index] + ")";
    }
  }

  for (let index = 0; index < req.body.tag.length; index++) {
    if (genres == "") {
      genres = genres + "(tag_id = " + req.body.tag[index] + ")";
    } else {
      genres = genres + " OR (tag_id = " + req.body.tag[index] + ")";
    }
  }

  let moviesearch = `SELECT * FROM movies WHERE (${persons}) AND (${genres})`;
  console.log(moviesearch);

  db.all(moviesearch, (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    output = rows;
  });

  res.send(output);
  // res.render("restirage.ejs", { output: result });
});

module.exports = router;
