const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("locations.db");

db.serialize(() => {
  db.all("SELECT * FROM locations", (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(rows);
    }
  });
});

db.close();
