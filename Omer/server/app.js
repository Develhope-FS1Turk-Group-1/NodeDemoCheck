const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require("cors");

require("dotenv").config();

app.use(express.json());
app.use(cors());

const connectionString = process.env.CONNECTION_URL;
const pool = new Pool({ connectionString });
let client;

async function connectDB() {
  client = await pool.connect();
  console.log("Successfully connected to db!");
}

// create player
app.post("/api/players", async (req, res) => {
  const { name, power } = req.body;

  const query = `
    INSERT INTO players (name, power)
    VALUES ($1, $2)
    RETURNING *
  `;

  const values = [name, power];

  const client = await pool.connect();
  const result = await client.query(query, values);
  client.release();

  res.json(result.rows[0]);
});

// Delete player
app.delete("/api/players/:id", async (req, res) => {
  const id = req.params.id;

  const query = `
    DELETE FROM players
    WHERE id = $1
  `;

  const values = [id];

  const client = await pool.connect();
  const result = await client.query(query, values);
  client.release();

  res.json({ message: `Player ${id} deleted successfully.` });
});

// get all players
app.get("/api/players", async (req, res) => {
  const query = `
    SELECT * FROM players
  `;

  const client = await pool.connect();
  const result = await client.query(query);
  client.release();

  res.json(result.rows);
});

// random increase
app.post("/api/players/power/increase", async (req, res) => {
  const query = `
    UPDATE players
    SET power = power + 1
    WHERE id = (SELECT id FROM players ORDER BY RANDOM() LIMIT 1)
  `;

  const client = await pool.connect();
  const result = await client.query(query);
  client.release();

  res.json({ message: `rastgele bir oyuncunun power değeri artırıldı` });
});

// random decrease
app.post("/api/players/power/decrease", async (req, res) => {
  const query = `
    UPDATE players
    SET power = power - 1
    WHERE id = (SELECT id FROM players ORDER BY RANDOM() LIMIT 1)
  `;

  const client = await pool.connect();
  const result = await client.query(query);
  client.release();

  res.json({ message: `rastgele bir oyuncunun power değeri düşürüldü` });
});

// server start
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
