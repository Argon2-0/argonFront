import './App.css';
import { Routes, Route } from "react-router-dom";
import Registro from './Pages/Registro/Registro';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import CrearUsuario from './Components/GestionUsuarios/CrearUsuario/CrearUsuario';
function App() {
  return (   
    <Routes>
      <Route exact path="/Bio/public/login" element={<Login />} />
      <Route exact path="/Bio/public/home" element={<Home />} />
      <Route exact path="/Bio/public/registro" element={<Registro />} />
    </Routes>
  );
}

export default App;
