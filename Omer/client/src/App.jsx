import React, { useState, useEffect } from "react";
import axios from "axios";

const PlayerDashboard = () => {
  const [name, setName] = useState("");
  const [power, setPower] = useState(0);
  const [players, setPlayers] = useState([]);
  const [disp, setDisp] = useState(0);

  const createPlayer = async () => {
    const response = await axios.post("http://localhost:3000/api/players", {
      name,
      power,
    });
    setPlayers([...players, response.data]);
  };

  const deletePlayer = async (id) => {
    await axios.delete(`http://localhost:3000/api/players/${id}`);
    setPlayers(players.filter((player) => player.id !== id));
  };

  const increaseRandomPlayerPower = async () => {
    await axios.post("http://localhost:3000/api/players/power/increase");
    getAllPlayers();
  };

  const decreaseRandomPlayerPower = async () => {
    await axios.post("http://localhost:3000/api/players/power/decrease");
    getAllPlayers();
  };

  const getAllPlayers = async () => {
    const response = await axios.get("http://localhost:3000/api/players");
    setPlayers(response.data);
    setDisp(disp + 1);
  };

  useEffect(() => {
    getAllPlayers();
  }, []);

  return (
    <div>
      <h1>Player Dashboard</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />{" "}
      <br />
      <input
        type="number"
        placeholder="Power"
        value={power}
        onChange={(e) => setPower(parseInt(e.target.value))}
      />{" "}
      <br />
      <button onClick={createPlayer}>Create Player</button>
      <br />
      <button onClick={increaseRandomPlayerPower}>
        Increase Random Player Power
      </button>
      <br />
      <button onClick={decreaseRandomPlayerPower}>
        Decrease Random Player Power
      </button>
      <br />
      <button onClick={getAllPlayers}>Get All Players</button>
      <br />
      <ul style={{ display: `${disp % 2 == 0 ? "none" : "block"}` }}>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} ({player.power})
            <button onClick={() => deletePlayer(player.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerDashboard;
