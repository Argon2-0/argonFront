import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import {
  DataGrid,
  GridToolbar,
  useGridApiRef,
  esES
} from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core';
import * as XLSX from "xlsx";
import '../../../App.css'
import { Empresa } from '../../../Data/Empresa';
import { Box, Input } from '@mui/material';
import { TableContainer, Table, TableRow, TableCell, TableBody } from '@mui/material';
import { ReactSession } from 'react-client-session';
import { useAlert } from '../../../AlertProvider';
import Spinner from '../../../Spinner';
const useStyles = makeStyles(() => ({
  esES,
}));

const EmpresaListar = () => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [empresa, setEmpresa] = useState([]);
  const { showAlert } = useAlert();
  useEffect(() => {
    fetch(
      ReactSession.get("basicUri") +
      "empresa/getAll",
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
        let empresas = [];
        console.log(json);
        console.log(empresas);
        for (let pos = 0; pos < body.length; pos++) {
          empresas.push(new Empresa(
            body[pos]['nit'],
            body[pos]['nombre']));
        }
        setRows(empresas);
      }).then(() => {
        console.log(false);
        setLoading(false);
      }).finally(() =>{
        console.log("flase");
        setLoading(false);
      }
      );
  }, []);


  const columns = [
    { field: 'nit', headerName: 'NIT',
    flex: 0.015 },
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
        setEmpresa(d)
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
    setLoading(true);
    console.log("handlesubmit")
    e.preventDefault();

    console.info('Valid Form')
    fetch(ReactSession.get("basicUri") + "empresa/createMasive", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify(empresa),
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
      }).catch((error) =>{
        handleShowErrorAlert()
      }).finally(() =>{
        console.log("flase");
        setLoading(false);
      })

  };
  const [loading, setLoading] = useState(true);
  return (

    <div>
      <Spinner open={loading} /> 
      <Box component="form" className="cardout" >
        <Typography variant="h4" component="h4" gutterBottom>
          Empresas
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
                <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={handleSubmit}>Guardar Masivo</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ height: 520 }} className="cardin">

          <DataGrid
            className={classes.esEs}
            getRowId={(row) => row.nit}
            rows={rows}
            slots={{ toolbar: GridToolbar }}
            columns={columns}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }
            apiRef={apiRef}
            style={{ fontSize: 'x-large' }} 
          />
        </Box>
      </Box>
    </div>
  );
};

export default EmpresaListar;
