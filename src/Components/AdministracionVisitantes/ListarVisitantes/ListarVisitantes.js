import { Box, Typography } from "@mui/material";
import { GridToolbar, DataGrid, useGridApiRef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Participante } from "../../../Data/Participante";
import './ListarVisitantes.css';
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
            },
          }
        )
          .then((response) => response.json())
          .then((json) => {
            let participantes = [];
            for (let pos = 0; pos < json.length; pos++) {
              console.log(json)
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
              
              participantes.push(new Participante(
                json[pos]['id'],
                json[pos]['tipoDocumento'],
                json[pos]['cedula'],
                json[pos]['nombres'],
                json[pos]['apellidos'],
                json[pos]['fechaNacimiento'],
                json[pos]['celular'],
                json[pos]['sexo'],
                json[pos]['email'],
                json[pos]['curso'],
                json[pos]['tratDatos'],
                json[pos]['estado'],
                json[pos]['createdAt'],
                json[pos]['updatedAt'],
                json[pos]['tiposervicio']
            ));
            }
            setRows(participantes);
          });
      }, []);

    const columns = [
        { field: 'id', 
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
        
        updatedAt: false,
        curso: false,
        fechaNacimiento: false,
        createdAt: false,
        estado: false
      });

      const apiRef = useGridApiRef();
    

    return (
        
        <div className="RegisterComponent">

            <Box className="card">
                <Typography variant="h4" component="h4" gutterBottom>
                    Administracion de visitantes
                </Typography>
                <Box sx={{ height: 520}}>
                    
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
