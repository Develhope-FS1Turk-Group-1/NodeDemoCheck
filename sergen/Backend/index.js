const express = require('express');
const app = express();
const cors = require('cors');
const pgp = require('pg-promise')();
const db = pgp('postgres://kljacueh:I8Ux4s3VWhV6IpP_INTesVLAiuyVkx9L@suleiman.db.elephantsql.com/kljacueh');
const PORT = 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// it will be checked if there is a players table
db.none(`DROP TABLE IF EXISTS players; CREATE TABLE players (id SERIAL PRIMARY KEY, fullname TEXT NOT NULL, power INTEGER NOT NULL);`)
.then(() => {
console.log('Players table created');
})
.catch((error) => {
console.error('Error creating users table:', error);
});

// SQL queries
const sql = {
    getAllPlayers: 'SELECT * FROM players',
    getPlayerById: 'SELECT * FROM players WHERE id=$1',
    createPlayer: 'INSERT INTO players (fullname, power) VALUES ($1, $2) RETURNING *',
    updatePlayer: ' UPDATE players SET power = $1 WHERE id = $2 RETURNING *',
    deletePlayer: 'DELETE FROM players WHERE id=$1 RETURNING *'
};

app.get('/players', async (req, res) => {
    try {
        const players = await db.any(sql.getAllPlayers);
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/players/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const player = await db.oneOrNone(sql.getPlayerById, +id);
        if (player) {
            res.json(player);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/players', async (req, res) => {
    const { fullname, power } = req.body;
    try {
        const newPlayer = await db.one(sql.createPlayer, [fullname, power]);
        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/players/:id', async (req, res) => {
    const { id } = req.params;
    const { power } = req.body;
    console.log(id, power);
    try {
        const updatedPlayer = await db.oneOrNone(sql.updatePlayer, [power, id]);
        if (updatedPlayer) {
            res.json(updatedPlayer);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/players/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPlayer = await db.oneOrNone(sql.deletePlayer, +id);
        if (deletedPlayer) {
            res.json(deletedPlayer);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
