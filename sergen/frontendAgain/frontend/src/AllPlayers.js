import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AllPlayers.css';

const AllPlayers = () => {
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/players');
                setPlayers(response.data);
            } catch (error) {
                setError('Error fetching data');
            }
        };
        fetchPlayers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/players/${id}`);
            setPlayers(players.filter(player => player.id !== id));
        } catch (error) {
            console.error('Error deleting player:', error);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="form">
            <div>
                <h1>All Player List</h1>
            </div>

            <ul className="player-list">
                {players.map((player) => (
                    <li key={player.id}>
                        <Link to={`/players/${player.id}`}>
                            {player.fullname}
                        </Link>
                        <div>
                            <button onClick={() => handleDelete(player.id)} className='delete-button'>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllPlayers;
