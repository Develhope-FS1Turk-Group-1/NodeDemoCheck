// Import necessary modules and configurations
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import the database connection module
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3050;

app.use(cors());
app.use(express.json());

// Endpoint to create a new player
app.post('/players', async (req, res) => {
  try {
    const { player, power } = req.body;
    const result = await db.one('INSERT INTO players(player, power) VALUES($1, $2) RETURNING *', [player, power]);

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to delete a player by ID
app.delete('/players/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.result('DELETE FROM players WHERE id = $1', id);

    if (result.rowCount === 1) {
      res.json({ message: 'Player deleted successfully' });
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get all players
app.get('/players', async (req, res) => {
  try {
    const players = await db.any('SELECT * FROM players');
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to increase power of a random player
app.put('/players/increasePower', async (req, res) => {
    try {
      const result = await db.one('UPDATE players SET power = power + 1 WHERE id = (SELECT id FROM players ORDER BY RANDOM() LIMIT 1) RETURNING *');
  
      res.json(result);
    } catch (error) {
      console.error('Error increasing power:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to decrease power of a random player
  app.put('/players/decreasePower', async (req, res) => {
    try {
      const result = await db.one('UPDATE players SET power = power - 1 WHERE id = (SELECT id FROM players ORDER BY RANDOM() LIMIT 1) RETURNING *');
  
      res.json(result);
    } catch (error) {
      console.error('Error decreasing power:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
