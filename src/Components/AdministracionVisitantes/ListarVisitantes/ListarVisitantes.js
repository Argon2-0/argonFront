import { Box, Typography } from "@mui/material";
import { GridToolbar, DataGrid, useGridApiRef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Participante } from "../../../Data/Participante";
import './ListarVisitantes.css';
import '../../../App.css'

const ListarVisitantes = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    fetch(
      window.$basicUri +
      "participante/getToday",
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': window.$token,
          "LastTime": window.$lastTime,
          "CurrentTime": window.$currentTime
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        window.$token = json[0];
        var body = json[1];
        console.log(body)
        let participantes = [];
        for (let pos = 0; pos < body.length; pos++) {
          console.log(json)
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

          participantes.push(new Participante(
            body[pos]['id'],
            body[pos]['tipoDocumento'],
            body[pos]['cedula'],
            body[pos]['nombres'],
            body[pos]['apellidos'],
            body[pos]['fechaNacimiento'],
            body[pos]['celular'],
            body[pos]['sexo'],
            body[pos]['email'],
            body[pos]['curso'],
            body[pos]['tratDatos'],
            body[pos]['estado'],
            body[pos]['createdAt'],
            body[pos]['updatedAt'],
            body[pos]['tiposervicio']
          ));
        }
        setRows(participantes);
      });
  }, []);

  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      flex: 0.1
    },
    {
      field: 'tipoDocumento',
      headerName: 'Tipo Documento',
      flex: 0.1
    },
    {
      field: 'cedula',
      headerName: 'Cedula',
      flex: 0.1
    },
    {
      field: 'nombres',
      headerName: 'Nombres',
      flex: 0.1
    },
    {
      field: 'apellidos',
      headerName: 'Apellidos',
      flex: 0.1
    },
    {
      field: 'fechaNacimiento',
      headerName: 'Fecha de nacimiento',
      flex: 0.1
    },
    {
      field: 'celular',
      headerName: 'Celular',
      flex: 0.1
    },
    {
      field: 'tiposervicio_nombre',
      headerName: 'Tipo de servicio',
      flex: 0.1
    },
    {
      field: 'sexo',
      headerName: 'Sexo',
      flex: 0.1
    },
    {
      field: 'curso',
      headerName: 'Curso',
      flex: 0.1
    },
    {
      field: 'tratDatos',
      headerName: 'Tratamiento de datos',
      flex: 0.1
    },
    {
      field: 'estado',
      headerName: 'Estado',
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
    updatedAt: false,
    curso: false,
    fechaNacimiento: false,
    createdAt: false,
    estado: false
  });

  const apiRef = useGridApiRef();


  return (

    <div className="RegisterComponent">

      <Box className="cardout">
        <Typography variant="h4" component="h4" gutterBottom>
          Administracion de visitantes
        </Typography>
        <Box sx={{ height: 520 }} className="cardin">

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

export default ListarVisitantes;
