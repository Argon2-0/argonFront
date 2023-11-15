import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Box, Input } from '@mui/material';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import './CursoListar.css';
import Swal from "sweetalert2";
import { json, useHistory } from 'react-router-dom';
import { renderEditProgress, renderEditStatus, renderProgress, renderStatus, useDemoData } from '@mui/x-data-grid-generator';
import {
  DataGrid,
  GridToolbar,
  useGridApiRef,
  esES
} from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core';
import * as XLSX from "xlsx";
import '../../../App.css'
import { Curso } from '../../../Data/Curso';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';


const useStyles = makeStyles((theme) => ({
  esES,
}));

const CursoListar = () => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [curso, setCurso] = useState([]);

  useEffect(() => {
    fetch(
      window.$basicUri +
      "curso/getAll",
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
        let cursos = [];
        console.log(json);
        console.log(cursos);
        for (let pos = 0; pos < body.length; pos++) {
          cursos.push(new Curso(
            body[pos]['codigo'],
            body[pos]['nombre']));
        }
        setRows(cursos);
      }).then(() => {
      });
  }, []);


  const columns = [
    { field: 'codigo', headerName: 'Codigo' },
    {
      field: 'nombre',
      headerName: 'Nombre',
      flex: 0.1
    },
   
  ];
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
    
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
        console.log(d[i]);
        setCurso(d)
      }
    });
  };
  const handleSubmit = (e) => {
    console.log("handlesubmit")
    e.preventDefault();

    console.info('Valid Form')
    fetch(window.$basicUri + "curso/createMasive", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify(curso),
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
          Cursos
        </Typography>

        <TableContainer style={{ alignItems: "right", width: "100%", background: "#ffcf00" }}>
          <Table style={{ width: "auto", alignContent: "center" }}>
            <TableBody>
              <TableRow>
                <TableCell >
                  <Button className="button" variant="contained" href="/Empresas.xlsx" download="Empresas.xlsx">
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
                <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={handleSubmit}>Guardar cambios</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ height: 520 }} className="cardin">

          <DataGrid
            className={classes.esEs}
            getRowId={(row) => row.codigo}
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

export default CursoListar;
