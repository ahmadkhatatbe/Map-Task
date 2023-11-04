const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("locations.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY, name TEXT, notes TEXT, lat REAL, lng REAL)"
  );
});

app.post("/places", (req, res) => {
  const { name, notes, lat, lng } = req.body;
  if (!name || !lat || !lng) {
    return res.status(400).json({ error: "Name, lat, and lng are required." });
  }

  db.run(
    "INSERT INTO locations (name, notes, lat, lng) VALUES (?, ?, ?, ?)",
    [name, notes, lat, lng],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Place created successfully" });
    }
  );
});

app.get("/places", (req, res) => {
  db.all("SELECT * FROM locations", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get("/places/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM locations WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(row);
  });
});

app.put("/places/:id", (req, res) => {
  const { name, notes, lat, lng } = req.body;
  const id = req.params.id;
  if (!name || !lat || !lng) {
    return res.status(400).json({ error: "Name, lat, and lng are required." });
  }

  db.run(
    "UPDATE locations SET name = ?, notes = ?, lat = ?, lng = ? WHERE id = ?",
    [name, notes, lat, lng, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Place updated successfully" });
    }
  );
});

app.delete("/places/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM locations WHERE id = ?", id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Place deleted successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
