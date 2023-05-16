import "./Leftbar.css";
import React, { useState, useEffect, useCallback } from "react";
import Avatar from "@mui/material/Avatar";

import Divider from "@material-ui/core/Divider";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Exit from "@mui/icons-material/ExitToApp";
import { Dashboard, Devices, ExpandLess, ExpandMore, MenuBook, MenuOpen, Person, ScreenShare, TransferWithinAStation } from "@material-ui/icons";
import { Article, ManageAccounts, MiscellaneousServices } from "@mui/icons-material";
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Collapse from "@mui/material/Collapse";
import ReplyIcon from '@mui/icons-material/Reply';
import SendIcon from '@mui/icons-material/Send';

const drawerWidth = 240;

const styleSidebar = () => ({
  bgcolor: `red`
})

const styles = (theme) => ({
  root: {
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});

export default function Leftbar({ changeSection }) {
  const { collapseSidebar } = useProSidebar();

  const [open, setOpen] = useState(false);
  const [openGestionUsuarios, setOpenGestionUsuarios] = useState(false);
  const [openAdministracionVisitantes, setOpenAdministracionVisitantes] = useState(false);
  const [openAdministracionEquipos, setOpenAdministracionEquipos] = useState(false);
  const [openTipoServicio, setOpenTipoServicio] = useState(false);
  const [openPrestamoComputadores, setOpenPrestamoComputadores] = useState(false);


  const [nConjunto, setnConjunto] = useState([]);

  const handleClickGestionUsuarios = () =>{
    if(openGestionUsuarios){
      setOpenGestionUsuarios(false);
    }
    else{
      setOpenGestionUsuarios(true);
    }
  }

  const handleClickOpenAdministracionVisitantes = () =>{
    if(openAdministracionVisitantes){
      setOpenAdministracionVisitantes(false);
    }
    else{
      setOpenAdministracionVisitantes(true);
    }
  }

  const handleClickAdministracionEquipos = () =>{
    if(openAdministracionEquipos){
      setOpenAdministracionEquipos(false);
    }
    else{
      setOpenAdministracionEquipos(true);
    }
  }

  const handleClickTipoServicio = () =>{
    if(openTipoServicio){
      setOpenTipoServicio(false);
    }
    else{
      setOpenTipoServicio(true);
    }
  }

  const handleClickPrestamoComputadores = () =>{
    if(openPrestamoComputadores){
      setOpenPrestamoComputadores(false);
    }
    else{
      setOpenPrestamoComputadores(true);
    }
  }



  const handleClick = () => {
    setOpen(!open);
  };



  return (

    <div className="drawer" >
      <Sidebar backgroundColor="#101533">

        <div className="sidebarWrapper">

          <List className="letras" >
            <ListItemButton
              name="Dasboard"
              className="letras"
              onClick={() => collapseSidebar()}
            >
              <ListItemIcon>
                <MenuBook className="sidebarIcon letras" />{" "}
              </ListItemIcon>
              <ListItemText className="letras">
                <center>
                  <Avatar
                    alt={window.$usuario.nombres}
                    src={"/people/" + window.$usuario.nombrefoto}
                    sx={{ width: 156, height: 156 }}
                  />
                  <div className="profileInfo">
                    <h4 className="letras">
                      {window.$usuario.nombres + " " + window.$usuario.apellidos}
                    </h4>
                    <p className="letras">{window.$usuario.email}</p>
                    <p className="letras">{window.$usuario.tipousuario}</p>
                  </div>
                </center>
              </ListItemText>
            </ListItemButton>

            <Divider />
            <hr className="sidebarHr" />


            <ListItemButton
              name="Dasboard"
              className="Dasboard"
              onClick={changeSection("Dasboard")}
            >
              <ListItemIcon>
                <Dashboard className="sidebarIcon letras" />{" "}
              </ListItemIcon>
              <ListItemText className="letras">Dasboard</ListItemText>
            </ListItemButton>

            <ListItemButton
              name="Perfil"
              className="Perfil"
              onClick={changeSection("Perfil")}
            >
              <ListItemIcon>
                <Person className="sidebarIcon letras" />{" "}
              </ListItemIcon>
              <ListItemText className="letras">Perfil</ListItemText>
            </ListItemButton>

            <ListItemButton
              name="GestionUsuarios"
              className="GestionUsuarios"
              onClick={handleClickGestionUsuarios}
            >
              <ListItemIcon>
                <ManageAccounts className="sidebarIcon letras" />{" "}
              </ListItemIcon>
              <ListItemText className="letras">Gestion de usuarios</ListItemText>
              {openGestionUsuarios ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openGestionUsuarios} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  name="GestionUsuariosCrear"
                  className="GestionUsuariosCrear"
                  onClick={changeSection("GestionUsuariosCrear")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <AddCircleOutlineIcon className="sidebarIcon letras" />{" "}
                  </ListItemIcon>
                  <ListItemText className="letras">Crear nuevo usuario</ListItemText>
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  name="GestionUsuariosListar"
                  className="GestionUsuariosListar"
                  onClick={changeSection("GestionUsuariosListar")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <FormatListBulletedIcon className="sidebarIcon letras" />{" "}
                  </ListItemIcon>
                  <ListItemText className="letras">Listar usuarios</ListItemText>
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton
              name="AdministracionVisitantes"
              className="AdministracionVisitantes"
              onClick={handleClickOpenAdministracionVisitantes}
            >
              <ListItemIcon>
                <TransferWithinAStation className="sidebarIcon letras" />{" "}
              </ListItemIcon>
              <ListItemText className="letras">Administracion de visitantes</ListItemText>
              {openAdministracionVisitantes ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openAdministracionVisitantes} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  name="AdministracionVisitantesCrear"
                  className="AdministracionVisitantesCrear"
                  onClick={changeSection("AdministracionVisitantesCrear")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <AddCircleOutlineIcon className="sidebarIcon letras" />{" "}
                  </ListItemIcon>
                  <ListItemText className="letras">Crear nuevo visitante</ListItemText>
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  name="AdministracionVisitantesListar"
                  className="AdministracionVisitantesListar"
                  onClick={changeSection("AdministracionVisitantesListar")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <FormatListBulletedIcon className="sidebarIcon letras" />{" "}
                  </ListItemIcon>
                  <ListItemText className="letras">Listar visitantes</ListItemText>
                </ListItemButton>
              </List>
            </Collapse>
            <ListItemButton
              name="AdministracionEquipos"
              className="AdministracionEquipos"
              onClick={handleClickAdministracionEquipos}
            >
              <ListItemIcon>
                <Devices className="sidebarIcon letras" />{" "}
              </ListItemIcon>
              <ListItemText className="letras">Administracion de equipos</ListItemText>
              {openAdministracionEquipos ? <ExpandLess /> : <ExpandMore />}

            </ListItemButton>
            <Collapse in={openAdministracionEquipos} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  name="AdministracionEquiposCrear"
                  className="AdministracionEquiposCrear"
                  onClick={changeSection("AdministracionEquiposCrear")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <AddCircleOutlineIcon className="sidebarIcon letras" />{" "}
                  </ListItemIcon>
                  <ListItemText className="letras">Crear nuevo equipo</ListItemText>
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  name="AdministracionEquiposListar"
                  className="AdministracionEquiposListar"
                  onClick={changeSection("AdministracionEquiposListar")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <FormatListBulletedIcon className="sidebarIcon letras" />{" "}
                  </ListItemIcon>
                  <ListItemText className="letras">Listar equipos</ListItemText>
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton
              name="PrestamoComputadores"
              className="PrestamoComputadores"
              onClick={handleClickPrestamoComputadores}
            >
              <ListItemIcon>
                <ScreenShare className="sidebarIcon letras" />{" "}
              </ListItemIcon>
              <ListItemText className="letras">Prestamo de computadores</ListItemText>
              {openPrestamoComputadores ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openPrestamoComputadores} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  name="PrestarComputador"
                  className="PrestarComputador"
                  onClick={changeSection("PrestarComputador")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon >
                    <SendIcon className="sidebarIcon letras" />{" "}
                  </ListItemIcon >
                  <ListItemText className="letras">Prestar computador</ListItemText>
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  name="DevolverComputador"
                  className="DevolverComputador"
                  onClick={changeSection("DevolverComputador")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon  >
                    <ReplyIcon className="sidebarIcon letras" />{" "}
                  </ListItemIcon  >
                  <ListItemText className="letras">Devolver computadotr</ListItemText>
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  name="ListarPrestamos"
                  className="ListarPrestamos"
                  onClick={changeSection("ListarPrestamos")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <FormatListBulletedIcon className="sidebarIcon letras" />{" "}
                  </ListItemIcon>
                  <ListItemText className="letras">Listar prestamos</ListItemText>
                </ListItemButton>
              </List>
            </Collapse>


            <ListItemButton
              name="Informes"
              className="Informes"
              onClick={changeSection("Informes")}
            >
              <ListItemIcon>
                <Article className="sidebarIcon letras" />{" "}
              </ListItemIcon>
              <ListItemText className="letras">Informes</ListItemText>
            </ListItemButton>
            <ListItemButton
              name="TipoServicio"
              className="TipoServicio"
              onClick={handleClickTipoServicio}
            >
              <ListItemIcon>
                <MiscellaneousServices className="sidebarIcon letras" />{" "}
              </ListItemIcon>
              <ListItemText className="letras">Tipo de servicio</ListItemText>
              {openTipoServicio ? <ExpandLess /> : <ExpandMore />}

            </ListItemButton>
            <Collapse in={openTipoServicio} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  name="TipoServicioCrear"
                  className="TipoServicioCrear"
                  onClick={changeSection("TipoServicioCrear")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <AddCircleOutlineIcon className="sidebarIcon letras" />{" "}
                  </ListItemIcon>
                  <ListItemText className="letras">Crear nuevo tipo de servicio</ListItemText>
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton
                  name="TipoServicioListar"
                  className="TipoServicioListar"
                  onClick={changeSection("TipoServicioListar")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <FormatListBulletedIcon className="sidebarIcon letras" />{" "}
                  </ListItemIcon>
                  <ListItemText className="letras">Listar tipos de servicio</ListItemText>
                </ListItemButton>
              </List>
            </Collapse>
            <ListItemButton
              name="Exit"
              className="Exit"
              onClick={changeSection("Exit")}
            >
              <ListItemIcon>
                <Exit className="sidebarIcon letras" />{" "}
              </ListItemIcon>
              <ListItemText className="letras">Exit</ListItemText>
            </ListItemButton>
          </List>
          <hr className="sidebarHr" />
        </div>
      </Sidebar>

    </div>
  );
}
