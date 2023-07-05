const sql = `INSERT INTO tags (name) VALUES (?)`;

db.run(sql, ["pétoche"], (err) => {
  if (err) {
    console.error(err.message);
  }
    console.log("Nouvelle ligne!");
  } );