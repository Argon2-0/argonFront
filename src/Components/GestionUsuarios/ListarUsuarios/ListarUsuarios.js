import { useEffect } from "react";
import React, { useState } from "react";
import { UserInfo } from "../../../Data/User/UserInfo";
import { GridToolbar, DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import './ListarUsuarios.css';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import * as XLSX from "xlsx";
import { Role } from "../../../Data/Role";
import '../../../App.css'
const ListarUsuarios = () => {
  const [rows, setRows] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

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
          if (json[pos]['fechaNacimiento'] != null) {
            json[pos]['fechaNacimiento'] = (json[pos]['fechaNacimiento'])[2] + "/" + (json[pos]['fechaNacimiento'])[1] + "/" + (json[pos]['fechaNacimiento'])[0];
          }
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
    {
      field: 'id',
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
      field: 'role_name',
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
    id:false,
    updatedAt: false
  });

  const apiRef = useGridApiRef();

  const getRoles = () => {

    let roles = [];
    fetch(
      window.$basicUri +
      "role/getAll",
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
          );;
          roles.push(new Role(
            json[pos]['id'],
            json[pos]['name'],
            json[pos]['description'],
            json[pos]['createdAt'],
            json[pos]['updatedAt']
          ));
        }
      }).then(() => {
        download(roles);
      });

  }

  const download = (data) => {
    let binaryParticipantes = XLSX.utils.json_to_sheet(data);
    var book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, binaryParticipantes, 'Binary values')
    XLSX.writeFile(book, 'Informe registros.xlsx');
  }

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
        d[i]["role"] ={["id"]: d[i]["roleId"]}
        console.log(d[i]);
        setUsuarios(d)
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    console.info('Valid Form')
    console.log(usuarios);
    fetch(window.$basicUri + "user/createMasive", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify(usuarios),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());

  };
  return (

    <div className="RegisterComponent">

      <Box className="cardout">
        <Typography variant="h4" component="h4" gutterBottom>
          Gestión de usuarios
        </Typography>
        <a href="/Computadores.xlsx" download="Computadores.xlsx">
          Descargar Archivo
        </a>
        <Box textAlign='center'>
          <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={getRoles}>Descargar listado de roles</Button>
        </Box>
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

export default ListarUsuarios;
