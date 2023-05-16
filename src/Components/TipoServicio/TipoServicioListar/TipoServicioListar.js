import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import './TipoServicioListar.css';
import Swal from "sweetalert2";
import { json, useHistory } from 'react-router-dom';
import { renderEditProgress, renderEditStatus, renderProgress, renderStatus, useDemoData } from '@mui/x-data-grid-generator';
import {
    DataGrid,
    GridToolbar,
    useGridApiRef,
    esES
  } from '@mui/x-data-grid';
import { TipoServicio } from '../../../Data/TipoServico';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  esES,
}));

const TipoServicioListar = () => {
  const classes = useStyles();
    const [rows, setRows] = useState([]);
    useEffect(() => {
        fetch(
          window.$basicUri +
            "tiposervicio/getAll",
          {
            mode: "cors",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((json) => {
            let tiposServicios = [] ;
            console.log(json);
            for (let pos = 0; pos < json.length; pos++) {
              json[pos]['createdAt']=new Date(json[pos]['createdAt']).toLocaleString(
                "es-CO",
                  {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  }
              );
              json[pos]['updatedAt']=new Date(json[pos]['updatedAt']).toLocaleString(
                "es-CO",
                  {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  }
              );;tiposServicios.push(new TipoServicio(
                json[pos]['id'],
                json[pos]['nombre'],
                json[pos]['descripcion'],
                json[pos]['createdAt'],
                json[pos]['updatedAt'],
                json[pos]['form']));
            }
            setRows(tiposServicios);
          }).then(()=>{
            console.log(rows)
          });
      }, []);


    const columns = [
        { field: 'id', headerName: 'Id' },
        {
          field: 'nombre',
          headerName: 'Nombre',
          flex: 0.1
        },
        {
          field: 'descripcion',
          headerName: 'Descripcion',
          flex: 0.1
        },
        {
          field: 'form',
          headerName: 'Form',
          type: 'text',
          flex: 0.1
        },
        {
          field: 'createdAt',
          headerName: 'Fecha de creación',
          flex: 0.1
        },
        {
          field: 'updatedAt',
          headerName: 'Fecha de actualización',
          flex: 0.1
        }
      ];
      const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
        createdAt: false,
        updatedAt: false
      });

      
      const apiRef = useGridApiRef();
    

    return (
        
        <div className="RegisterComponent">

                <Box component="form" className="card">
                <Typography variant="h4" component="h4" gutterBottom>
                    Tipos de servicios
                </Typography>
                    <Box sx={{ height: 520}}>
                        
                        <DataGrid
                        className={classes.esEs}
                        rows={rows}
                        slots={{ toolbar: GridToolbar }}
                        columns={columns}
                        columnVisibilityModel={columnVisibilityModel}
                        onColumnVisibilityModelChange={(newModel) =>
                          setColumnVisibilityModel(newModel)
                        }
                        apiRef={apiRef}
                       
                        />
                    </Box>
                </Box>
        </div>
    );
};

export default TipoServicioListar;
