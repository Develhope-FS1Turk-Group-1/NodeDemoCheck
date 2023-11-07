import React, { useState } from 'react';
import axios from 'axios';

function CreatePlayer() {
    const [fullname, setFullname] = useState('');
    const [power, setPower] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    const handleFullname = (e) => {
        setFullname(e.target.value);
        setSubmitted(false);
    };

    const handlePower = (e) => {
        setPower(e.target.value);
        setSubmitted(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
		console.log(fullname);
		console.log(power);
        if (fullname === '' || power === '') {
            setError(true);
        } else {
			console.log('i am here')
            try {
                const response = await axios.post('http://localhost:4000/players', {
                    fullname: fullname,
                    power: parseInt(power) // Assuming power is an integer
                });
				
				console.log(response);
                if (response.status === 201) {
                    setSubmitted(true);
                    setError(false);
                } else {
                    setSubmitted(false);
                    setError(true);
                }
            } catch (error) {
                setSubmitted(false);
                setError(true);
            }
        }
    };

    const successMessage = () => {
        return (
            <div
                className="success"
                style={{
                    display: submitted ? '' : 'none',
                }}>
                <h1>Player successfully created!!</h1>
            </div>
        );
    };

    const errorMessage = () => {
        return (
            <div
                className="error"
                style={{
                    display: error ? '' : 'none',
                }}>
                <h1>Please enter all the fields</h1>
            </div>
        );
    };

    return (
        <div className="form">
            <div>
                <h1>Create Player</h1>
            </div>

            <div className="messages">
                {errorMessage()}
                {successMessage()}
            </div>

            <form>
                <label className="label">Fullname</label>
                <input onChange={handleFullname} className="input" value={fullname} type="text" />

                <label className="label">Power</label>
                <input onChange={handlePower} className="input" value={power} type="number" />

                <button onClick={handleSubmit} className="btn" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default CreatePlayer;
