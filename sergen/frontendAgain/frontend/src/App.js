import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import AllPlayers from './AllPlayers';
import CreatePlayer from './CreatePlayer';
import DecreaseRPlayer from './DecreaseRPlayer';
import IncreaseRPlayer from './IncreaseRPlayer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/all_players">All Players</Link>
            </li>
            <li>
              <Link to="/create_player">Create Player</Link>
            </li>
            <li>
              <Link to="/increase_r_player">Increase Random Player's Power</Link>
            </li>
            <li>
              <Link to="/decrease_r_player">Decrease Random Player's Power</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/create_player" element={<CreatePlayer />} />
          <Route path="/increase_r_player" element={<IncreaseRPlayer />} />
          <Route path="/decrease_r_player" element={<DecreaseRPlayer />} />
          <Route path="/all_players" element={<AllPlayers />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
