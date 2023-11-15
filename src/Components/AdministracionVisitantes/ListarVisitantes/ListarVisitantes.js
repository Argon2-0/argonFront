import { Box, Typography, Input } from "@mui/material";
import { GridToolbar, DataGrid, useGridApiRef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Participante } from "../../../Data/Participante";
import '../../../App.css'
import SendIcon from '@mui/icons-material/Send';
import * as XLSX from "xlsx";
import Button from '@mui/material/Button';
import { ParticipanteMasivo } from "../../../Data/ParticipanteMasivo";
import { TipoServicio } from "../../../Data/TipoServico";
import { zktPerson } from "../../../Data/zkt/zktPersona";
import dayjs from "dayjs";
import { Empresa } from "../../../Data/Empresa";
import { RegistroCurso } from "../../../Data/RegistroCurso";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';


const ListarVisitantes = () => {
  const [rows, setRows] = useState([]);
  const [visitantesArray, setVisitantesArray] = useState([]);
  const [zktUsersArray, setZktUsersArray] = useState([]);
  const [registroCursos, setRegistroCursos] = useState([]);
  useEffect(() => {
    fetch(
      window.$basicUri +
      "participante/getToday",
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
        for (let pos = 0; pos < body.length; pos++) {
          console.log(json)
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

          participantes.push(new Participante(
            body[pos]['id'],
            body[pos]['tipoDocumento'],
            body[pos]['cedula'],
            body[pos]['nombres'],
            body[pos]['apellidos'],
            body[pos]['fechaNacimiento'],
            body[pos]['celular'],
            body[pos]['sexo'],
            body[pos]['email'],
            body[pos]['curso'],
            body[pos]['tratDatos'],
            body[pos]['estado'],
            body[pos]['createdAt'],
            body[pos]['updatedAt'],
            body[pos]['tiposervicio']
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
    id: false,
    updatedAt: false,
    curso: false,
    fechaNacimiento: false,
    createdAt: false,
    estado: false
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
    let participantes = [];
    let zktUsers = [];
    let registrosCursos = [];
    promise.then((d) => {

      for (var i in d) {
        console.log(Date.now());
        participantes.push(
          new ParticipanteMasivo(
            (d[i])['tipoDocumento'],
            (d[i])['cedula'],
            (d[i])['nombres'],
            (d[i])['apellidos'],
            (d[i])['celular'],
            (d[i])['sexo'],
            (d[i])['tratDatos'],
            new Date(new dayjs((d[i])['fechaNacimiento']).toISOString()).getTime(),
            Date.now(),
            new TipoServicio((d[i])['tiposervicioId']),
            new Empresa((d[i])['empresaNit'])

          ))

        zktUsers.push(
          new zktPerson(
            (d[i])['fechaNacimiento'],
            (d[i])['cedula'],
            (d[i])['cedula'],
            (d[i])['cedula'],
            documentosZK((d[i])['tipoDocumento']),
            genero((d[i])['sexo']),
            (d[i])['apellidos'],
            (d[i])['celular'],
            (d[i])['nombres'],
            (d[i])['cedula'],
            new Date(new dayjs((d[i])['fechaInicio']).toISOString()).getTime(),
            new Date(new dayjs((d[i])['fechaFin']).toISOString()).getTime()
          )
        )

        registrosCursos.push(
          new RegistroCurso(
            (d[i])['cursoId'],
            (d[i])['tipoDocumento'],
            (d[i])['cedula'],
            new Date(new dayjs((d[i])['fechaInicio']).toISOString()).getTime(),
            new Date(new dayjs((d[i])['fechaFin']).toISOString()).getTime()
          )
        )
      }
    }).then(() => { setVisitantesArray(participantes) })
      .then(() => { setZktUsersArray(zktUsers) })
      .then(() => { setRegistroCursos(registrosCursos) });
  };



  const documentosZK = (value) => {
    switch (value) {
      case 'C.C':
        return 2000;
      case 'C.E':
        return 2002;
      case 'Registro único tributario':
        return 8;
      case 'Registro civil':
        return 8;
      case 'Numero identificación tributaria':
        return 8;
      case 'Pasaporte':
        return 3;
      case 'T.I':
        return 2001;
      case 'Permiso de permanencia':
        return 2004;
      case 'NIT':
        return 8;
      case 'Desconocido':
        return 8;
      default:
        return 8;



    }
  }

  const genero = (value) => {
    switch (value) {
      case 'Masculino':
        return "M";
      case 'Femenino':
        return "F";
    }
  }

  const handleSubmit = (e) => {
    console.log(visitantesArray)
    console.log("handlesubmit")
    e.preventDefault();

    console.info('Valid Form')
    console.log(visitantesArray)
    console.log(visitantesArray[0])
    //for (var i in visitantesArray) {
    //  console.log(i)      ;
    fetch(window.$basicUri + "participante/createMasive", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify(visitantesArray),
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
        fetch(window.$basicUri + "visitantecurso/createMasive/", {
          mode: "cors",
          method: "POST",
          body: JSON.stringify(registroCursos),
          headers: {
            "Content-Type": "application/json",
            'Authorization': window.$token,
            "LastTime": window.$lastTime,
            "CurrentTime": window.$currentTime
          },
        }).then((responserequest) => responserequest.json())
          .then((jsonrequest) => {
            fetch(window.$basicUri + "zkt/persona/createMasive", {
              mode: "cors",
              method: "POST",
              body: JSON.stringify(zktUsersArray),
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
          })
      })
    //}

  };
  return (

    <div className="RegisterComponent">

      <Box className="cardout">
        <Typography variant="h4" component="h4" gutterBottom>
          Administracion de visitantes
        </Typography>
        <TableContainer style={{ alignItems: "right", width: "100%", background: "#ffcf00" }}>
          <Table style={{ width: "auto", alignContent: "center" }}>
            <TableBody>
              <TableRow>
                <TableCell >
                  <Button className="button" variant="contained" href="/visitantes.xlsx" download="visitantes.xlsx">
                    Descargar plantilla
                  </Button>
                </TableCell>
                <TableCell >
                  <Typography variant="h5" component="h5" >
                    Cargar masivo &nbsp;
                    <Input
                      type="file"
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
