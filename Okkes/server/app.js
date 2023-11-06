const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { Client } = require('pg');

dotenv.config();
app.use(bodyParser.json());
app.use(cors());





const connectionString = process.env.DB_URL;
const client = new Client({
	connectionString: connectionString,
});

client.connect();

const players = [];


app.post('/players', async (req, res) => {
	const { name, power } = req.body;

	try {
		const result = await client.query(
			'INSERT INTO players (name, power) VALUES ($1, $2) RETURNING id',
			[name, power],
		);
		const newPlayer = { id: result.rows[0].id, name, power };
		players.push(newPlayer);
		res.status(201).json(newPlayer);
	} catch (error) {
		console.error('An error occurred while adding a player: ', error);
		res.status(500).json({
			error: 'An error occurred while adding a player',
		});
	}
});

app.delete('/players/:id', (req, res) => {
	const playerId = parseInt(req.params.id);
	const index = players.findIndex((player) => player.id === playerId);
	if (index !== -1) {
		players.splice(index, 1);
		res.sendStatus(204);
	} else {
		res.status(404).json({ error: 'Player not found' });
	}
});

app.get('/players', (req, res) => {
	res.json(players);
});

app.put('/players/increase-power', (req, res) => {
	if (players.length === 0) {
		return res.status(404).json({ error: 'No players available' });
	}
	const randomIndex = Math.floor(Math.random() * players.length);
	players[randomIndex].power += 10;
	res.json(players[randomIndex]);
});

app.put('/players/decrease-power', (req, res) => {
	if (players.length === 0) {
		return res.status(404).json({ error: 'No players available' });
	}
	const randomIndex = Math.floor(Math.random() * players.length);
	players[randomIndex].power -= 10;
	res.json(players[randomIndex]);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
