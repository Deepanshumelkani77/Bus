import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Bus from './pages/Bus'

const App = () => {
  return (
  
      <div className="w-full h-screen ">
        <Navbar />
        <Sidebar />
        <main className="mt-[10vh] lg:ml-[25%] ">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bus" element={<Bus />} />
          </Routes>
        </main>
      </div>
   
  )
}

export default App
