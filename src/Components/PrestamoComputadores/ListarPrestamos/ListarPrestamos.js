import { Box, Typography } from "@mui/material";
import { GridToolbar, DataGrid, useGridApiRef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Participante } from "../../../Data/Participante";
import './ListarPrestamos.css';
import { HerramientaParticipante } from "../../../Data/HerramientaParticipante";
const ListarPrestamos = () => {
    const [rows, setRows] = useState([]);
    useEffect(() => {
        fetch(
          window.$basicUri +
            "herramientaparticipante/getToday",
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
            let participantes = [];
            for (let pos = 0; pos < json.length; pos++) {
              if(json[pos]['fechaNacimiento']!=null){
                json[pos]['fechaNacimiento']=(json[pos]['fechaNacimiento'])[2]+"/"+(json[pos]['fechaNacimiento'])[1]+"/"+(json[pos]['fechaNacimiento'])[0];
              }
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
              );;
              participantes.push(new HerramientaParticipante(
                json[pos]['id'],
                json[pos]['observacion'],
                json[pos]['estado'],
                json[pos]['totHoras'],
                json[pos]['createdAt'],
                json[pos]['updatedAt'],
                json[pos]['participante'],
                json[pos]['herramienta'],
            ));
            }
            setRows(participantes);
          });
      }, []);

    const columns = [
        { field: 'herrmienta_codigoBarras', 
          headerName: 'Codigo de barras', 
          flex: 0.1
        },
        {
          field: 'participante_cedula',
          headerName: 'Número documento', 
          flex: 0.1
        },
        {
          field: 'participante_nombres',
          headerName: 'Nombres', 
          flex: 0.1
        },
        {
          field: 'participante_apellidos',
          headerName: 'Apellidos',
          flex: 0.1
        },
        {
          field: 'estado',
          headerName: 'Estado',
          flex: 0.1
        },
        {
          field: 'observacion',
          headerName: 'Observacion',
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

            <Box className="card">
                <Typography variant="h4" component="h4" gutterBottom>
                    Historial de computadores prestados
                </Typography>
                <Box sx={{ height: 520, width: 'auto'}}>
                    
                    <DataGrid
                    rows={rows}
                    columns={columns}
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={(newModel) =>
                        setColumnVisibilityModel(newModel)
                    }
                    slots={{ toolbar: GridToolbar }}
                    apiRef={apiRef}
                    />
                </Box>
            </Box>
        </div>
    );
};

export default ListarPrestamos;
