const sql = `INSERT INTO stbpotes (name) VALUES (?)`;

db.run(sql, ["mec"], (err) => {
  if (err) {
    console.error(err.message);
  }
    console.log("Nouvelle ligne!");
  } );