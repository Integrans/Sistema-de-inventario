//import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Movimientos from './components/Movimientos';

function App() {

  return (
    <Router>
      <Routes>
        {/* REDIRIGIR LA RUTA RAIZ A LA RUTA DE LOGIN */}
        <Route path='/' element={<Navigate to="/login" />} />

        {/* RUTA PARA LA PAGINA DE LOGIN*/}
        <Route path='/login' element={<Login />} />
        
        {/*RUTA PARA EL DASHBOARD DESPUES DE LOGEARSE */}
        <Route path='/dashboard' element={<Dashboard />} />
        {/*RUTA PARA EL HISTORIAL DE MOVIMIENTOS */}
        <Route path='/movimientos' element={<Movimientos />} />
      </Routes>
    </Router>
  )
}

export default App
