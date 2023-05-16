import { useEffect } from "react";
import React, { useState } from "react";
import { UserInfo } from "../../../Data/User/UserInfo";
import { GridToolbar, DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import './ListarUsuarios.css';
const ListarUsuarios = () => {
    const [rows, setRows] = useState([]);
    useEffect(() => {
        fetch(
          window.$basicUri +
            "userInfo/getAll",
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
            let roleJson = "";
            let role = "";
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
              participantes.push(new UserInfo(
                json[pos]['id'],
                json[pos]['name'],
                json[pos]['email'],
                json[pos]['emailVerifiedAt'],
                json[pos]['emapictureil'],
                json[pos]['rememberToken'],
                json[pos]['createdAt'],
                json[pos]['updatedAt'],
                (json[pos]['role'])['id'],
                (json[pos]['role'])['name'],
                (json[pos]['role'])['description'],
                (json[pos]['role'])['createdAt'],
                (json[pos]['role'])['updatedAt'],
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
          field: 'name',
          headerName: 'Nombres', 
          flex: 0.1
        },
        {
          field: 'email',
          headerName: 'Email', 
          flex: 0.1
        },
        {
          field: 'roleName',
          headerName: 'Role',
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
        
        updatedAt: false
      });

      const apiRef = useGridApiRef();
    

    return (
        
        <div className="RegisterComponent">

            <Box className="card">
                <Typography variant="h4" component="h4" gutterBottom>
                    Gestión de usuarios
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

export default ListarUsuarios;
