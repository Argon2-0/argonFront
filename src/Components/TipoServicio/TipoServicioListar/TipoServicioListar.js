import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import {
  DataGrid,
  GridToolbar,
  useGridApiRef,
  esES
} from '@mui/x-data-grid';
import { TipoServicio } from '../../../Data/TipoServico';
import { makeStyles } from '@material-ui/core';
import * as XLSX from "xlsx";
import '../../../App.css'
import { TableContainer, Table, TableRow, TableCell, TableBody } from '@mui/material';
import { Box, Typography, Input } from "@mui/material";


const useStyles = makeStyles((theme) => ({
  esES,
}));

const TipoServicioListar = () => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [tiposServicios, setTiposServico] = useState([]);
  useEffect(() => {
    fetch(
      window.$basicUri +
      "tiposervicio/getAll",
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
        let tiposServicios = [];
        console.log(json);
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
          );; tiposServicios.push(new TipoServicio(
            body[pos]['id'],
            body[pos]['nombre'],
            body[pos]['descripcion'],
            body[pos]['createdAt'],
            body[pos]['updatedAt'],
            body[pos]['form']));
        }
        setRows(tiposServicios);
      }).then(() => {
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
    id: false,
    createdAt: false,
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
        console.log(d[i]);
        setTiposServico(d)
      }
    });
  };
  const handleSubmit = (e) => {
    console.log("handlesubmit")
    e.preventDefault();

    console.info('Valid Form')
    fetch(window.$basicUri + "/tiposervicio/createMasive", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify(tiposServicios),
      headers: {
        "Content-Type": "application/json",
        'Authorization': window.$token,
        "LastTime": window.$lastTime,
        "CurrentTime": window.$currentTime
      },
    }).then((response) => response.json())
      .then((json) => {
        console.log(json);
        window.$token = json[0];
      })

  };
  return (

    <div>
      <Box component="form" className="cardout" >
        <Typography variant="h4" component="h4" gutterBottom>
          Tipos de servicios
        </Typography>
        <TableContainer style={{ alignItems: "right", width: "100%", background: "#ffcf00" }}>
          <Table style={{ width: "auto", alignContent: "center" }}>
            <TableBody>
              <TableRow>
                <TableCell >
                  <Button className="button" variant="contained" href="/Tipos de servicio.xlsx" download="Tipos de servicio.xlsx">
                    Descargar plantilla 
                  </Button>
                </TableCell>
                <TableCell >
                  <Typography variant="h5" component="h5" >
                    Cargar masivo &nbsp;
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
                <Button className="button" variant="contained" endIcon={<SendIcon />} onSubmit={handleSubmit}>Guardar cambios</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ height: 520 }} className="cardin">

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
