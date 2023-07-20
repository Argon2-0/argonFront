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
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import * as XLSX from "xlsx";
import '../../../App.css'

const ListarEquipos = () => {
  const [rows, setRows] = useState([]);
  const [computadores, setComputadores] = useState([]);

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
        let herramientas = [];
        let participanteJson = "";
        let participante = "";
        let tipoServicioJson = "";
        let tipoServicio = "";
        for (let pos = 0; pos < json.length; pos++) {
          json[pos]['createdAt'] = new Date(json[pos]['createdAt']).toLocaleString(
            "es-CO",
            {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }
          );
          json[pos]['updatedAt'] = new Date(json[pos]['updatedAt']).toLocaleString(
            "es-CO",
            {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }
          );; herramientas.push(new Herramienta(
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
    {
      field: 'id',
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
    id:false,
    codigoBarras: false,
    participante: false,
    updatedAt: false
  });

  const apiRef = useGridApiRef();
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      for (var i in d) {
        d[i]["createdAt"] = Date.now();
        d[i]["estado"] = "Disponible";
        console.log(d[i]);
        setComputadores(d)
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    console.info('Valid Form')
    fetch(window.$basicUri + "herramienta/createMasive", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify(computadores),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());

  };

  return (

    <div className="RegisterComponent">

      <Box className="cardout">
        <Typography variant="h4" component="h4" gutterBottom>
          Listar equipos
        </Typography>
        <a href="/Computadores.xlsx" download="Computadores.xlsx">
          Descargar Archivo
        </a>
        <div>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              readExcel(file);
            }}
          />
          <Box textAlign='center'>
            <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={handleSubmit}>Guardar cambios</Button>
          </Box>
        </div>
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

export default ListarEquipos;
