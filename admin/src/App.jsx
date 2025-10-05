import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-white via-slate-50 to-white flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 min-w-0 lg:pl-72 transition-[padding] duration-300 ease-out">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main role="main" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>


      </div>
    </div>
  )
}

export default App
