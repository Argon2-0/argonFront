import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import React, { useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import '../../App.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Token from '../../Auth/Token';
ChartJS.register(ArcElement, Tooltip, Legend);



const Dasboard = () => {
  const [fechaInicio, setFechaInicio] = useState(dayjs(new Date()));
  const [fechaFin, setFechaFin] = useState(dayjs(new Date()));
  const [labelsVisitsByService, setLabelsVisitsByService] = useState([""]);
  const [DataVisitsByService, setDataVisitsByService] = useState([""]);
  const [labelsVisitsByEdad, setLabelsVisitsByEdad] = useState([""]);
  const [DataVisitsByEdad, setDataVisitsByEdad] = useState([""]);
  const [labelsVisitsBySexo, setLabelsVisitsBySexo] = useState([""]);
  const [DataVisitsBySexo, setDataVisitsBySexo] = useState([""]);
  const [labelsComputadores, setLabelsComputadores] = useState([""]);
  const [DataComputadores, setDataComputadores] = useState([""]);
  const [visitas, setVisitas] = useState(0);
  const [visitantes, setVisitantes] = useState(0);
  const [vista, setVista] = useState("VISITANTES");
  const [prestamos, setPrestamos] = useState(0);
  const [usuariosPrestados, setUsuariosPrestados] = useState(0);
  const [horasPrestamo, setHorasPrestamo] = useState(0);

  const handleDateIniciochange = (event) => {
    var token = new Token();
    token.validar();
    setFechaInicio(event.$d);
    setData();
  }

  const handleDateFinchange = (event) => {
    setFechaFin(event.$d);
    setData();
  }

  const setData = () => {
    if (vista === "VISITANTES") {
      getvisitsByService();
      getvisitsByEdad();
      getvisitsBySexo();
      getvisits();
    }
    else if (vista === "COMPUTADORES") {
      getComputadores();
      getComputadoresEstados();
    }
  }




  const getvisitsByService = () => {
    fetch(
      window.$basicUri +
      "participante/countByTiposervicio/" + new Date(fechaInicio.toISOString()).getTime() + "/" + new Date(fechaFin.toISOString()).getTime(),
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
        setLabelsVisitsByService(json[0]);
        setDataVisitsByService(json[1]);
      });
  }

  const getvisitsByEdad = () => {
    fetch(
      window.$basicUri +
      "participante/countByEdad/" + new Date(fechaInicio.toISOString()).getTime() + "/" + new Date(fechaFin.toISOString()).getTime(),
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
        console.log(json)
        setLabelsVisitsByEdad(json[0]);
        setDataVisitsByEdad(json[1]);
      });
  }

  const changeToVisitantes = () => {
    setVista("VISITANTES");
    setData();
  }
  const changeToComputadores = () => {
    setVista("COMPUTADORES");
    setData();
  }
  const getvisitsBySexo = () => {
    fetch(
      window.$basicUri +
      "participante/countBySexo/" + new Date(fechaInicio.toISOString()).getTime() + "/" + new Date(fechaFin.toISOString()).getTime(),
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
        console.log(json)
        setLabelsVisitsBySexo(json[0]);
        setDataVisitsBySexo(json[1]);
      });
  }

  const getvisits = () => {
    fetch(
      window.$basicUri +
      "participante/findVisitantes/" + new Date(fechaInicio.toISOString()).getTime() + "/" + new Date(fechaFin.toISOString()).getTime(),
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
        console.log(json)
        setVisitantes(json[0]);
        setVisitas(json[1]);
      });
  }

  const getComputadores = () => {
    fetch(
      window.$basicUri +
      "herramientaparticipante/getDataForDashboard/" + new Date(fechaInicio.toISOString()).getTime() + "/" + new Date(fechaFin.toISOString()).getTime(),
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
        setUsuariosPrestados(json[0]);
        setPrestamos(json[1]);
        setHorasPrestamo(json[2]);
      });
  }

  const getComputadoresEstados = () => {
    fetch(
      window.$basicUri +
      "herramienta/getEstadosForDasboard",
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
        console.log(json)
        setLabelsComputadores(json[0]);
        setDataComputadores(json[1]);
      });
  }

  const backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
  ]

  const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ]

  const visitsByService = {
    labels: labelsVisitsByService,
    datasets: [
      {
        label: 'Numero de visitas por servicio',
        data: DataVisitsByService,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  const visitsByEdad = {
    labels: labelsVisitsByEdad,
    datasets: [
      {
        label: 'Numero de visitas por edad',
        data: DataVisitsByEdad,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  const visitsBySexo = {
    labels: labelsVisitsBySexo,
    datasets: [
      {
        label: 'Numero de visitas por sexo',
        data: DataVisitsBySexo,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  const computersStates = {
    labels: labelsComputadores,
    datasets: [
      {
        label: 'Estado computadores',
        data: DataComputadores,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };


  return (
    <div>
      <Box className="cardout">
        <Box className="cardin">
          <br />
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Stack direction="row" spacing={8} >
                      <Box textAlign='center'>
                        <Button class="button" variant="contained" endIcon={<SendIcon />} onClick={changeToVisitantes}>VISITANTES</Button>
                        <Button class="button" variant="contained" endIcon={<SendIcon />} onClick={changeToComputadores}>COMPUTADORES</Button>
                      </Box>
                    </Stack>
                    <br />
                    <Stack direction="row" spacing={8} >
                      <br />
                      <Typography variant="h6" component="h6" spacing={2}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fecha de inicio
                      </Typography>
                      <DatePicker
                        required
                        autoOk={true}
                        id="FechaDeInicio"
                        name="fechaInicio"
                        value={fechaInicio}
                        onChange={handleDateIniciochange}
                        style={{ width: 300 }}
                        noValidate
                      />
                      <Typography variant="h6" component="h6" spacing={2}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fecha de fin
                      </Typography>

                      <DatePicker
                        required
                        autoOk={true}
                        id="FechaDeFin"
                        name="fechaFin"
                        value={fechaFin}
                        onChange={handleDateFinchange}
                        style={{ width: 300 }}
                        noValidate
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <br />

        {(vista === "VISITANTES")
          ? (<>
            <Box className="cardin">
              <Stack direction="row" spacing={8} >
                <Typography variant="h6" component="h6" spacing={2}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total visitas {visitas}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total visitantes {visitantes}
                </Typography>
              </Stack>
            </Box>
            <br />
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <TableContainer>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Box className="cardin sizer">
                                  <Stack direction="row" spacing={8} >
                                    <br />
                                    <Pie data={visitsByService} style={{ width: "500px" }} options={{ maintainAspectRatio: false }} />

                                  </Stack>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box className="cardin sizer">
                                  <Stack direction="row" spacing={8} >
                                    <br />
                                    <Pie data={visitsByEdad} style={{ width: "500px" }} options={{ maintainAspectRatio: false }} />

                                  </Stack>
                                </Box>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <center>
                        <Box className="cardin sizer">
                          <Stack direction="row" spacing={8} >
                            <br />
                            <Pie data={visitsBySexo} style={{ width: "500px" }} options={{ maintainAspectRatio: false }} />

                          </Stack>
                        </Box>
                      </center>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>) : ""}


        {(vista === "COMPUTADORES")
          ? (<>
            <Box className="cardin">
              <Stack direction="row" spacing={8} >
                <Typography variant="h6" component="h6" spacing={2}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total préstamos {prestamos}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total usuarios {usuariosPrestados}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total de horas de préstamo {horasPrestamo}
                </Typography>
              </Stack>
            </Box>

            <br />
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <center>
                        <Box className="cardin sizer">
                          <Stack direction="row" spacing={8} >
                            <br />
                            <Pie data={computersStates} style={{ width: "500px" }} options={{ maintainAspectRatio: false }} />

                          </Stack>
                        </Box>
                      </center>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>) : ""}
      </Box>
    </div>

  );
};

export default Dasboard;
