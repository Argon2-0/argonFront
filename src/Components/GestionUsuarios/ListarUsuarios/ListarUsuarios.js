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
        let roleJson = "";
        let role = "";
        for (let pos = 0; pos < body.length; pos++) {
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
          participantes.push(new UserInfo(
            body[pos]['id'],
            body[pos]['name'],
            body[pos]['email'],
            body[pos]['emailVerifiedAt'],
            body[pos]['emapictureil'],
            body[pos]['rememberToken'],
            body[pos]['createdAt'],
            body[pos]['updatedAt'],
            (body[pos]['role'])['id'],
            (body[pos]['role'])['name'],
            (body[pos]['role'])['description'],
            (body[pos]['role'])['createdAt'],
            (body[pos]['role'])['updatedAt'],
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
    id: false,
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
          );;
          roles.push(new Role(
            body[pos]['id'],
            body[pos]['name'],
            body[pos]['description'],
            body[pos]['createdAt'],
            body[pos]['updatedAt']
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
        d[i]["role"] = { ["id"]: d[i]["roleId"] }
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

    <div className="RegisterComponent">

      <Box className="cardout">
        <Typography variant="h4" component="h4" gutterBottom>
          Gestión de usuarios
        </Typography>
        <a href="/Computadores.xlsx" download="Computadores.xlsx">
          Descargar plantilla
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
