use

const sql = `INSERT INTO movies (title, stb_id, tag_id) VALUES (?, ?, ?)`;

db.run(sql, ["Casablanca", 2, 1], (err) => {
  if (err) {
    console.error(err.message);
  }
    console.log("Nouvelle ligne!");
  } );