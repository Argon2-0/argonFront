import React from "react";
import '../../App.css';
import CrearVisitantes from "../../Components/AdministracionVisitantes/CrearVisitantes/CrearVisitantes";
import './Registro.css';
const Registro = () => {

  return (
    <div className="side" style={{backgroundImage: `url('/images/colsubsidiobanner.png')`, backgroundSize: "12.5%", backgroundPositionX:"100%", backgroundPositionY:"50px", backgroundRepeat:"no-repeat", height:"200%"}}>
      <div className="verticalbar" />
      <div className="topbar"></div>
        <form  className=" position spaceRegistro">
          <CrearVisitantes/>
        </form></div>
  );
};

export default Registro;
