import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Home from './pages/Home';
import Track from './pages/Track';
import LiveTracking from './pages/LiveTracking';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/track" element={<Track />} />
        <Route path="/live-tracking/:tripId" element={<LiveTracking />} />
      </Routes>
    </div>
  );
}

export default App;
