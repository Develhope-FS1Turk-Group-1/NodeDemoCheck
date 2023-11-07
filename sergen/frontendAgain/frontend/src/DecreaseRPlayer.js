import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DecreaseRPlayer() {
    const [players, setPlayers] = useState([]);
    const [playerId, setPlayerId] = useState('');
    const [playerPower, setPlayerPower] = useState(0);
    const [playerName, setPlayerName] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPower, setCurrentPower] = useState(0);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/players');
                setPlayers(response.data);
                if (response.data.length > 0) {
                    const randomIndex = Math.floor(Math.random() * response.data.length);
                    setPlayerId(response.data[randomIndex].id);
                    setCurrentPower(response.data[randomIndex].power);
                    setPlayerName(response.data[randomIndex].fullname);
                }
            } catch (error) {
                setError('Error fetching data');
            }
        };
        fetchPlayers();
    }, []);

    const handlePlayerPower = (e) => {
        setPlayerPower(e.target.value);
        setError(null);
        setSuccessMessage('');
    };

    const handleDecreasePower = async (e) => {
        e.preventDefault();
        if (playerId !== '' && currentPower >= playerPower) {
            try {
                const response = await axios.put(`http://localhost:4000/players/${playerId}`, {
                    power: playerPower
                });

                if (response.status === 200) {
                    setSuccessMessage(`Power decreased for player ID: ${playerId}`);
                    setError(null);
                }
            } catch (error) {
                setError('Error in decreasing power or player not found');
                setSuccessMessage('');
            }
        } else{
            setError('Current Power must be bigger or equal to Player Power');
        }
    };

    return (
        <div className="form">
            <div>
                <h1>Decrease Player Power</h1>
            </div>

            <div className="messages">
                {error && <div className="error">{error}</div>}
                {successMessage && <div className="success">{successMessage}</div>}
            </div>

            <div className='row'>
                <label htmlFor="playerName">Player Name:</label>
                <input
                    id="playerName"
                    value={playerName}
                    type="text"
                    disabled
                    className="input"
                />
                </div>
                <div className='row'>
                <label htmlFor="currentPower">Current Power:</label>
                <input
                    id="currentPower"
                    value={currentPower}
                    type="text"
                    disabled
                    className="input"
                />
            </div>
                
            <form>
                <input
                    onChange={handlePlayerPower}
                    value={playerPower}
                    type="text"
                    className="input"
                />

                <button onClick={handleDecreasePower} className="btn" type="submit">
                    Decrease Power
                </button>
            </form>
        </div>
    );
}

export default DecreaseRPlayer;
