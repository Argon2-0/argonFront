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
import { TableContainer, Table, TableRow, TableCell, TableBody } from '@mui/material';
import { ReactSession } from 'react-client-session';
import { useAlert } from '../../../AlertProvider';
import Spinner from "../../../Spinner";
import { Curso } from "../../../Data/Curso";
const ListarVisitantes = () => {
  const [rows, setRows] = useState([]);
  const [visitantesArray, setVisitantesArray] = useState([]);
  const [zktUsersArray, setZktUsersArray] = useState([]);
  const [registroCursos, setRegistroCursos] = useState([]);
  const { showAlert } = useAlert();
  useEffect(() => {
    fetch(
      ReactSession.get("basicUri") +
      "participante/getToday",
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
            body[pos]['celular'],
            body[pos]['email'],
            body[pos]['tratDatos'],
            body[pos]['estado'],
            body[pos]['createdAt'],
            body[pos]['updatedAt']
          ));
        }
        setRows(participantes);
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
      field: 'tipoDocumento',
      headerName: 'Tipo Documento',
      flex: 0.1
    },
    {
      field: 'cedula',
      headerName: 'Documento',
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
      field: 'curso',
      headerName: 'Evento',
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
            (d[i])['documento'],
            (d[i])['nombres'],
            (d[i])['apellidos'],
            (d[i])['celular'],
            (d[i])['tratDatos'],
            Date.now(),
          ))

        zktUsers.push(
          new zktPerson(
            (d[i])['documento'],
            (d[i])['documento'],
            (d[i])['documento'],
            documentosZK((d[i])['tipoDocumento']),
            (d[i])['apellidos'],
            (d[i])['celular'],
            (d[i])['nombres'],
            (d[i])['documento'],
            new Date(new dayjs((d[i])['fechaInicio']).toISOString()).getTime(),
            new Date(new dayjs((d[i])['fechaFin']).toISOString()).getTime()
          )
        )

        registrosCursos.push(
          new RegistroCurso(
            new Curso((d[i])['eventoId']),
            (d[i])['tipoDocumento'],
            (d[i])['documento'],
            new Date(new dayjs((d[i])['fechaInicio']).toISOString()).getTime(),
            new Date(new dayjs((d[i])['fechaFin']).toISOString()).getTime(),
            new TipoServicio((d[i])['tiposervicioId']),
            new Empresa((d[i])['empresaNit'])
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

  const handleShowSuccessAlert = () => {
    showAlert('success', 'El masivo se cargo correctamente');
  };

  const handleShowErrorAlert = () => {
    showAlert('error', 'Hubo un problema al cargar el archivo masivo');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(ReactSession.get("basicUri") + "participante/createMasive", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify(visitantesArray),
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
        fetch(ReactSession.get("basicUri") + "visitavisitante/createMasive/", {
          mode: "cors",
          method: "POST",
          body: JSON.stringify(registroCursos),
          headers: {
            "Content-Type": "application/json",
            'Authorization': ReactSession.get("token"),
            "LastTime": ReactSession.get("lastTime"),
            "CurrentTime": ReactSession.get("currentTime"),
            "id": ReactSession.get("idRol")
          },
        }).then((responserequest) => responserequest.json())
          .then((jsonrequest) => {
            fetch(ReactSession.get("basicUri") + "zkt/persona/createMasive", {
              mode: "cors",
              method: "POST",
              body: JSON.stringify(zktUsersArray),
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
          }).finally(() => {
            console.log("flase");
            setLoading(false);
          });
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
            style={{ fontSize: 'x-large' }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default ListarVisitantes;
