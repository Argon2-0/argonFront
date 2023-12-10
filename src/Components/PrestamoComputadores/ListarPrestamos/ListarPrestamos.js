import { Box, Typography } from "@mui/material";
import { GridToolbar, DataGrid, useGridApiRef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import './ListarPrestamos.css';
import { HerramientaParticipante } from "../../../Data/HerramientaParticipante";
import '../../../App.css'
import { ReactSession } from 'react-client-session';
const ListarPrestamos = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    fetch(
      ReactSession.get("basicUri") +
      "herramientaparticipante/getToday",
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': ReactSession.get("token"),
          "LastTime": ReactSession.get("lastTime"),
          "CurrentTime": ReactSession.get("currentTime"),
                        "id": ReactSession.get("idRol")
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        ReactSession.set("token", json[0]);
        var body = json[1];
        console.log(body)
        let participantes = [];
        for (let pos = 0; pos < body.length; pos++) {
          if (body[pos]['fechaNacimiento'] != null) {
            body[pos]['fechaNacimiento'] = (body[pos]['fechaNacimiento'])[2] + "/" + (body[pos]['fechaNacimiento'])[1] + "/" + (body[pos]['fechaNacimiento'])[0];
          }
          body[pos]['createdAt'] = new Date(body[pos]['createdAt']).toLocaleString(
            "es-CO",
            {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }
          );
          body[pos]['updatedAt'] = new Date(body[pos]['updatedAt']).toLocaleString(
            "es-CO",
            {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }
          );;
          participantes.push(new HerramientaParticipante(
            body[pos]['id'],
            body[pos]['observacionSalida'],
            body[pos]['observacionEntrada'],
            body[pos]['estado'],
            body[pos]['totHoras'],
            body[pos]['createdAt'],
            body[pos]['updatedAt'],
            body[pos]['participante'],
            body[pos]['herramienta'],
          ));
        }
        setRows(participantes);
      });
  }, []);

  const columns = [
    {
      field: 'herrmienta_codigoBarras',
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
    id: false,
    createdAt: false,
    updatedAt: false
  });

  const apiRef = useGridApiRef();


  return (

    <div className="RegisterComponent">

      <Box className="cardout">
        <Typography variant="h4" component="h4" gutterBottom>
          Historial de Computadores Prestados
        </Typography>
        <Box sx={{ height: 520, width: 'auto' }} className="cardin">

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
