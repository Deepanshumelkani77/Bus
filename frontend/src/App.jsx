import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Home from './pages/Home';


import About from './pages/About';
import SmartTripSearch from './pages/SmartTripSearch';
import LiveTracking from './pages/LiveTracking';

function App() {
  const location = useLocation();
  
  // Pages where navbar should not be shown
  const hideNavbarPaths = [ '/login'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="App">
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
 
        <Route path="/smart-search" element={<SmartTripSearch />} />
       
        <Route path="/about" element={<About />} />
        <Route path="/live-tracking/:tripId" element={<LiveTracking />} />
      </Routes>
    </div>
  );
}

export default App;
