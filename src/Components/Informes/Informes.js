import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import './Informes.css';
import Swal from "sweetalert2";
import { useHistory } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Participante } from '../../Data/Participante';
import XlsExport from 'xlsexport';

const Informes = () => {

    const handleChange = e => {
        const { name, value } = e.target;
    };
    const [open, setOpen] = useState(false);
    const [fechaInicio, setFechaInicio] = useState(dayjs(new Date()));
    const [fechaFin, setFechaFin] = useState(dayjs(new Date()));
    const [tipoInforme, setTipoInforme] = useState("");



    const handleSubmit = (e) => {
    };
    const handleDateIniciochange = (event, date) => {
        setFechaInicio(date);
    }

    const handleDateFinchange = (event, date) => {
        setFechaFin(date);
    }

    const handleChangeTipoInforme = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setTipoInforme(value);
        console.log(tipoInforme)
    }

    const download = () => {
        console.log("download");
        let participantes = [];
        fetch(
            window.$basicUri +
            "participante/getBetween",
            {
                mode: "cors",
                method: "GET",
                body: JSON.stringify({
                    fechaInicio: fechaInicio.toDate().toISOString(),
                    fechaFin: fechaFin.toDate().toISOString(),

                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((response) => response.json())
            .then((json) => {

                for (let pos = 0; pos < json.length; pos++) {
                    console.log(json)
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

                    participantes.push(new Participante(
                        json[pos]['id'],
                        json[pos]['tipoDocumento'],
                        json[pos]['cedula'],
                        json[pos]['nombres'],
                        json[pos]['apellidos'],
                        json[pos]['fechaNacimiento'],
                        json[pos]['celular'],
                        json[pos]['sexo'],
                        json[pos]['email'],
                        json[pos]['curso'],
                        json[pos]['tratDatos'],
                        json[pos]['estado'],
                        json[pos]['createdAt'],
                        json[pos]['updatedAt'],
                        json[pos]['tiposervicio']
                    ));
                }
            }).then(() => {
                const xls = new XlsExport(participantes, "title");
                xls.exportToXLS('export.xls')
                
            });
    }

    const downloadAction = (csvString, fileName = 'test.csv') => {
        // Creamos el elemento para hacer el trigger del download
        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(csvString));
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return (
        <div className="RegisterComponent">

            <Box component="form" sx={{ mt: 1 }} className="card">

                <Typography variant="h4" align="Left" component="h4" gutterBottom>
                    Editar perfil
                </Typography>

                <br />
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} className="card">

                    <Stack direction="row" spacing={2} >

                        <Typography variant="h6" component="h6" spacing={2}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tipo informe
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={8} >
                        <br />
                        <Select
                            required
                            id="Informe"
                            name="Informe"
                            value={tipoInforme}
                            onChange={handleChangeTipoInforme}
                            style={{ width: 300 }}
                        >
                            <MenuItem key="1" value="InformeRegistro" width="300">Registro</MenuItem>
                            <MenuItem key="2" value="InformePrestamosComputador" width="300">Cantidad de prestamos por computador</MenuItem>
                            <MenuItem key="3" value="ReporteEntradasSalidas" width="300">Entradas y salidas</MenuItem>

                        </Select>

                    </Stack>


                    <br />
                    {(tipoInforme === "InformePrestamosComputador")
                        ? (<>
                            <Stack direction="row" spacing={2} >

                                <Typography variant="h6" component="h6" spacing={2}>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Marca equipo
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={8}>
                                <br />
                                <TextField
                                    required
                                    id="MarcaEquipo"
                                    name="MarcaEquipo"
                                    label="Marca equipo"
                                    variant="outlined" />
                            </Stack><br /></>) : ""}
                    {(tipoInforme === "ReporteEntradasSalidas")
                        ? (<>
                            <Stack direction="row" spacing={2} >

                                <Typography variant="h6" component="h6" spacing={2}>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Número documento
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={8}>
                                <br />
                                <TextField
                                    required
                                    id="Cedula"
                                    name="Cedula"
                                    label="Número documento"
                                    variant="outlined" />
                            </Stack><br /></>) : ""}
                    <Stack direction="row" spacing={2} >

                        <Typography variant="h6" component="h6" spacing={2}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fecha de inicio
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={8} >
                        <br />
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
                    </Stack>
                    <br />
                    <Stack direction="row" spacing={2} >

                        <Typography variant="h6" component="h6" spacing={2}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fecha de fin
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={8} >
                        <br />
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
                    <br />
                    <Box textAlign='center'>
                        <Button class="button" variant="contained" endIcon={<SendIcon />} onClick={download}>Descargar Informe</Button>

                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default Informes;
