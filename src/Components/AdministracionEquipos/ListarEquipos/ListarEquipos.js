import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import {
    DataGrid,
    GridToolbar,
    useGridApiRef,
  } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { Herramienta } from '../../../Data/Herramienta';
import { Participante } from '../../../Data/Participante';
import { TipoServicio } from '../../../Data/TipoServico';

const ListarEquipos = () => {
    const [rows, setRows] = useState([]);
    useEffect(() => {
        fetch(
          window.$basicUri +
            "herramienta/getAll",
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
            let herramientas =[];
            let participanteJson = "";
            let participante = "";
            let tipoServicioJson = "";
            let tipoServicio = "";
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
              );;herramientas.push(new Herramienta(
                json[pos]['id'],
                json[pos]['nombre'],
                json[pos]['descripcion'],
                json[pos]['marca'],
                json[pos]['serial'],
                json[pos]['codigoBarras'],
                json[pos]['estado'],
                json[pos]['createdAt'],
                json[pos]['updatedAt'],
                json[pos]['participante'],
                
                ));            
            }
            setRows(herramientas);
          });
      }, []);

    const columns = [
        { field: 'id', 
          headerName: 'Id', 
          flex: 0.1
        },
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
          field: 'marca',
          headerName: 'Marca',
          type: 'text', 
          flex: 0.1
        },
        {
          field: 'serial',
          headerName: 'Serial',
          type: 'text', 
          flex: 0.1
        },
        {
          field: 'codigoBarras',
          headerName: 'Codigo de barras',
          type: 'text', 
          flex: 0.1
        },
        {
          field: 'estado',
          headerName: 'Estado',
          type: 'text',
          flex: 0.1
        },
        {
          field: 'participante',
          headerName: 'Participante',
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
        
        codigoBarras: false,
        participante: false,
        updatedAt: false
      });

      const apiRef = useGridApiRef();
    

    return (
        
        <div className="RegisterComponent">

            <Box className="card">
                <Typography variant="h4" component="h4" gutterBottom>
                    Listar equipos
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

export default ListarEquipos;
