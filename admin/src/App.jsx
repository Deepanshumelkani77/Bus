import React, { useContext } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Bus from './pages/Bus'
import Driver from './pages/Driver'
import Login from './pages/Login'

const App = () => {
  const { isAuthenticated } = useContext(AppContext)
  const location = useLocation()
  
  const isLoginPage = location.pathname === '/login'
  const isAuth = isAuthenticated()

  // If not authenticated and not on login page, show login
  if (!isAuth && !isLoginPage) {
    return <Login />
  }

  // If on login page, show login
  if (isLoginPage) {
    return <Login />
  }

  // If authenticated, show the main app
  return (
    <div className="w-full h-screen">
      <Navbar />
      <Sidebar />
      <main className="mt-[10vh] lg:ml-[25%]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bus" element={<Bus />} />
          <Route path="/driver" element={<Driver />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
