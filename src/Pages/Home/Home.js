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
import CrearEmpresa from "../../Components/Empresa/EmpresaCrear/EmpresaCrear";
import EmpresaListar from "../../Components/Empresa/EmpresaListar/EmpresaListar";
import CrearCurso from "../../Components/Curso/CursoCrear/CursoCrear";
import CursoListar from "../../Components/Curso/CursoListar/CursoListar";
//import colsubsidio from "/images/colsubsidio.png";
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
      case "EmpresaCrear":
        return <CrearEmpresa />;
      case "EmpresasListar":
        return <EmpresaListar />;
      case "CursoCrear":
        return <CrearCurso />;
      case "CursoListar":
        return <CursoListar />;
      case "Exit":
        window.$token = "";
        history("../Bio/public/login");
      default:
        return <Dashboard />;
    }
  };

  const handleTime = () => {

    if (((((Date.now() - window.$currentTime) % 86400000) % 3600000) / 60000) < 20) {
      window.$lastTime = window.$currentTime;
      window.$currentTime = Date.now();
    }
    else {
      window.$token = "";
      history("../Bio/public/login");
    }
  }

  return (
    <div onClick={handleTime} onKeyUp={handleTime}>
      <div className="topbar" ></div>
      <div style={{backgroundImage: `url('/images/colsubsidiobanner.png')`, backgroundSize: "12.5%", backgroundPositionX: "100%", backgroundRepeat: "no-repeat", height: "1%" }}>
        <div className="Container">
          {showSidebar &&

            <Leftbar changeSection={changeSection} />}
          {!showSidebar && <Button><MenuOpen></MenuOpen></Button>}
        </div>
        <div className="rightside">

          <div className="leftabsolute">
            <center>
              {switchSection(section)}
            </center>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
