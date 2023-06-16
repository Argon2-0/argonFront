import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../Components/Dashboard/Dasboard"
import Perfil from "../../Components/Perfil/Perfil"
import Informes from "../../Components/Informes/Informes"
import TipoServicioListar from "../../Components/TipoServicio/TipoServicioListar/TipoServicioListar"
import Leftbar from "../../Components/Leftbar/Leftbar";
import './Home.css';
import { Button } from "react-bootstrap";
import { MenuOpen } from "@material-ui/icons";
import ListarUsuarios from "../../Components/GestionUsuarios/ListarUsuarios/ListarUsuarios";
import CrearUsuario from "../../Components/GestionUsuarios/CrearUsuario/CrearUsuario";
import ListarVisitantes from "../../Components/AdministracionVisitantes/ListarVisitantes/ListarVisitantes";
import CrearVisitantes from "../../Components/AdministracionVisitantes/CrearVisitantes/CrearVisitantes";
import ListarEquipos from "../../Components/AdministracionEquipos/ListarEquipos/ListarEquipos";
import CrearEquipos from "../../Components/AdministracionEquipos/CrearEquipos/CrearEquipos";
import CrearTipoServicio from "../../Components/TipoServicio/TipoServicioCrear/TipoServicioCrear";
import ListarPrestamos from "../../Components/PrestamoComputadores/ListarPrestamos/ListarPrestamos";
import PrestarComputadores from "../../Components/PrestamoComputadores/PrestarComputadores/PrestarComputadores";
import DevolverComputadores from "../../Components/PrestamoComputadores/DevolverComputadores/DevolverComputadores";
import '../../App.css';
const Home = () => {
  let history = useNavigate();
  const [section, setSection] = useState("Dasboard");
  const [showSidebar, setShowSidebar] = useState(true);
  const handleToggleSideBar = () => {
    setShowSidebar(!showSidebar);
  }

  const changeSection = (some) => () => {
    console.log(section);
    setSection(some);
  };
  const switchSection = (param) => {
    switch (param) {
      case "Dasboard":
        return <Dashboard />;
      case "Perfil":
        return <Perfil />;
      case "GestionUsuariosCrear":
        return <CrearUsuario />;
      case "GestionUsuariosListar":
        return <ListarUsuarios />;
      case "AdministracionVisitantesCrear":
        return <CrearVisitantes />;
      case "AdministracionVisitantesListar":
        return <ListarVisitantes />;
      case "AdministracionEquiposCrear":
        return <CrearEquipos />;
      case "AdministracionEquiposListar":
        return <ListarEquipos />;
      case "PrestarComputador":
        return <PrestarComputadores />;
      case "DevolverComputador":
        return <DevolverComputadores />;
      case "ListarPrestamos":
        return <ListarPrestamos />;
      case "Informes":
        return <Informes />;
      case "TipoServicioCrear":
        return <CrearTipoServicio />;
      case "TipoServicioListar":
        return <TipoServicioListar />;
      case "Exit":
        history.push("/");
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      <div className="Container">
        {showSidebar &&

          <Leftbar changeSection={changeSection} />}
        {!showSidebar && <Button><MenuOpen></MenuOpen></Button>}
      </div>
      <div className="rightside">
        <div className="topbar"></div>
        <div className="leftabsolute">
          <center>
            {switchSection(section)}
          </center>
        </div>
      </div>

    </div>
  );
};

export default Home;
