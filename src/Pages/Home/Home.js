import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../Components/Dashboard/Dasboard"
import Perfil from "../../Components/Perfil/Perfil"
import Informes from "../../Components/Informes/Informes"
import TipoServicioListar from "../../Components/TipoServicio/TipoServicioListar/TipoServicioListar"
import Leftbar from "../../Components/Leftbar/Leftbar";
import './Home.css';
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
import { ReactSession } from 'react-client-session';
//import colsubsidio from "/images/colsubsidio.png";
const Home = () => {
  let history = useNavigate();
  const [section, setSection] = useState("Dasboard");

  const changeSection = (some) => () => {
    console.log(section);
    setSection(some);
  };
  const switchSection = (param) => {
    switch (param) {
      default:
        return <Dashboard />;
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
        ReactSession.set("token", "");
        history("../Bio/public/login");
        break;
    }
  };

  const handleTime = () => {

    if (((((Date.now() - ReactSession.get("currentTime")) % 86400000) % 3600000) / 60000) < 20) {
      ReactSession.set("lastTime", ReactSession.get("currentTime"));
      ReactSession.set("currentTime", Date.now());
    }
    else {
      ReactSession.set("token", "");
      history("../Bio/public/login");
    }
  }

  return (
    <div onClick={handleTime} onKeyUp={handleTime}>
      <div className="topbar">© 2023<a href="https://www.vision2cloud.com/" target="_blank" rel="noreferrer">
        Vision2Cloud
      </a></div>
      <div style={{ backgroundImage: `url('/images/colsubsidiobanner.png')`, backgroundSize: "12.5%", backgroundPositionX: "100%", backgroundRepeat: "no-repeat", height: "1%" }}>
        <div className="Container">

          <Leftbar changeSection={changeSection} />
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
