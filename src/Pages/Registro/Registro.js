import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Avatar, TextField, makeStyles, Button } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import UserIcon from "@mui/icons-material/Person";
import PasswordIcon from "@mui/icons-material/Password";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Email } from "@material-ui/icons";
import '../../App.css';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CrearVisitantes from "../../Components/AdministracionVisitantes/CrearVisitantes/CrearVisitantes";
import './Registro.css';
import AutoCrearVisitante from "../../Components/AdministracionVisitantes/AutoCrearVisitante/AutoCrearVisitante";
const Registro = () => {
  const paperStyle = {
    padding: 20,
    height: "60vh",
    width: 310,
    margin: "20px auto",
    background: `${"white"}`,
  };
 

  return (
    <div className="side" style={{backgroundImage: `url('/images/black.png'),url('/images/colsubsidioce.png'),url('/images/colsubsidiobanner.png')`, backgroundSize: "48%,48%, 12.5%", backgroundPositionX:"0px, 0px, 1700px", backgroundPositionY:"700px, 50px,50px", backgroundRepeat:"no-repeat"}}>
      <div className="verticalbar" />
      <div className="topbar"></div>
        <form  className=" position spaceRegistro">
          <AutoCrearVisitante/>
        </form></div>
  );
};

export default Registro;
