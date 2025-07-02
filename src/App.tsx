import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './atoms/globals.css'

// Importar páginas
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Convenios from './pages/Convenios'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/convenios" element={<Convenios />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
