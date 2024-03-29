import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  GridToolbar,
  useGridApiRef,
} from '@mui/x-data-grid';
import { Box, Input } from '@mui/material';
import { Herramienta } from '../../../Data/Herramienta';
import { Participante } from '../../../Data/Participante';
import { TipoServicio } from '../../../Data/TipoServico';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import * as XLSX from "xlsx";
import '../../../App.css'
import { ReactSession } from 'react-client-session';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useAlert } from '../../../AlertProvider';
import Spinner from '../../../Spinner';

const ListarEquipos = () => {
  const [rows, setRows] = useState([]);
  const [computadores, setComputadores] = useState([]);
  const { showAlert } = useAlert();
  useEffect(() => {
    fetch(
      ReactSession.get("basicUri") +
      "herramienta/getAll",
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
        let herramientas = [];
        let participanteJson = "";
        let participante = "";
        let tipoServicioJson = "";
        let tipoServicio = "";
        for (let pos = 0; pos < body.length; pos++) {
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
          );; herramientas.push(new Herramienta(
            body[pos]['id'],
            body[pos]['nombre'],
            body[pos]['descripcion'],
            body[pos]['marca'],
            body[pos]['serial'],
            body[pos]['codigoBarras'],
            body[pos]['estado'],
            body[pos]['createdAt'],
            body[pos]['updatedAt'],
            body[pos]['participante'],

          ));
        }
        setRows(herramientas);
      }).finally(() => {
        console.log("flase");
        setLoading(false);
      });;
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
    id: false,
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

  const handleShowSuccessAlert = () => {
    showAlert('success', 'El masivo se cargo correctamente');
  };

  const handleShowErrorAlert = () => {
    showAlert('error', 'Hubo un problema al cargar el archivo masivo');
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.info('Valid Form')
    fetch(ReactSession.get("basicUri") + "herramienta/createMasive", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify(computadores),
      headers: {
        "Content-Type": "application/json",
        'Authorization': ReactSession.get("token"),
        "LastTime": ReactSession.get("lastTime"),
        "CurrentTime": ReactSession.get("currentTime"),
        "id": ReactSession.get("idRol")
      },
    }).then((response) => response.json())
      .then((json) => {
        console.log(json);
        ReactSession.set("token", json[0]);
        handleShowSuccessAlert()
      }).catch((error) => {
        handleShowErrorAlert()
      }).finally(() => {
        console.log("flase");
        setLoading(false);
      });

  };
  const [loading, setLoading] = useState(true);
  return (

    <div className="RegisterComponent">
      <Spinner open={loading} />
      <Box className="cardout">
        <Typography variant="h4" component="h4" gutterBottom>
          Listar Equipos
        </Typography>
        <TableContainer style={{ alignItems: "right", width: "100%", background: "#ffcf00" }}>
          <Table style={{ width: "auto", alignContent: "center" }}>
            <TableBody>
              <TableRow>
                <TableCell >
                  <Button className="button" variant="contained" href="/Computadores.xlsx" download="Computadores.xlsx">
                    Descargar plantilla
                  </Button>
                </TableCell>
                <TableCell >
                  <Typography variant="h5" component="h5" >
                    Cargar masivo  &nbsp;
                    <Input
                      type="file"
                      variant="contained"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        readExcel(file);
                      }}
                    />
                  </Typography>
                </TableCell>
                <TableCell >
                  <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={handleSubmit}>Guardar Masivo</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <br />
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
            style={{ fontSize: 'x-large' }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default ListarEquipos;
