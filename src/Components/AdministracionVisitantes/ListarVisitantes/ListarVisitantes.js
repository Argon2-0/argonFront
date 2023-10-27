import { Box, Typography } from "@mui/material";
import { GridToolbar, DataGrid, useGridApiRef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Participante } from "../../../Data/Participante";
import './ListarVisitantes.css';
import '../../../App.css'
import SendIcon from '@mui/icons-material/Send';
import { makeStyles } from '@material-ui/core';
import * as XLSX from "xlsx";
import Button from '@mui/material/Button';
import { ParticipanteMasivo } from "../../../Data/ParticipanteMasivo";
import { TipoServicio } from "../../../Data/TipoServico";
import { zktPerson } from "../../../Data/zkt/zktPersona";


const ListarVisitantes = () => {
  const [rows, setRows] = useState([]);
  const [visitantesArray, setVisitantesArray] = useState([]);
  const [zktUsersArray, setZktUsersArray] = useState([]);
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
            new Date((d[i])['fechaNacimiento'].toISOString()).getTime(),
            Date.now(),
            new TipoServicio((d[i])['tiposervicioId']),
          ))

        zktUsers.push(
          new zktPerson(
            new Date((d[i])['fechaNacimiento'].toISOString()).getTime(),
            (d[i])['cedula'],
            (d[i])['cedula'],
            (d[i])['cedula'],
            documentosZK((d[i])['tipoDocumento']),
            (d[i])['sexo'],
            (d[i])['apellidos'],
            (d[i])['celular'],
            (d[i])['nombres'],
            (d[i])['cedula'],
          )
        )
      }
    }).then(() => { setVisitantesArray(participantes) }).then(() => { setZktUsersArray(zktUsers) });
  };



  const documentosZK = (value) => {
    switch (value) {
      case 'C.C':
        this.setState({ ["tipoDocumentoZK"]: 2000 });
        break;
      case 'C.E':
        this.setState({ ["tipoDocumentoZK"]: 2002 });
        break;
      case 'Registro único tributario':
        this.setState({ ["tipoDocumentoZK"]: 8 });
        break;
      case 'Registro civil':
        this.setState({ ["tipoDocumentoZK"]: 8 });
        break;
      case 'Numero identificación tributaria':
        this.setState({ ["tipoDocumentoZK"]: 8 });
        break;
      case 'Pasaporte':
        this.setState({ ["tipoDocumentoZK"]: 3 });
        break;
      case 'T.I':
        this.setState({ ["tipoDocumentoZK"]: 2001 });
        break;
      case 'Permiso de permanencia':
        this.setState({ ["tipoDocumentoZK"]: 2004 });
        break;
      case 'NIT':
        this.setState({ ["tipoDocumentoZK"]: 8 });
        break;
      case 'Desconocido':
        this.setState({ ["tipoDocumentoZK"]: 8 });
        break;
      default:
        break;



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
        fetch(window.$basicUri + "participante/getByTipoDocumentoAndCedula/" + this.state.tipoDocumento + "/" + this.state.cedula, {
          mode: "cors",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': window.$token,
            "LastTime": window.$lastTime,
            "CurrentTime": window.$currentTime
          },
        }).then((responserequest) => responserequest.json())
          .then((jsonrequest) => {
            console.log(jsonrequest)
            console.log((jsonrequest[1])['id'])
            console.log(this.state.fechaInicio)
            console.log(this.state.fechaFin)
            fetch(window.$basicUri + "visitantecurso/create", {
              mode: "cors",
              method: "POST",
              body: JSON.stringify({ zktUsersArray }),
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
        <a href="/visitantes.xlsx" download="visitantes.xlsx">
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

export default ListarVisitantes;
