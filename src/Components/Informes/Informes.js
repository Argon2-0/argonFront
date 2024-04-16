import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import './Informes.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Participante } from '../../Data/Participante';
import * as XLSX from "xlsx";
import { HerramientaParticipante } from '../../Data/HerramientaParticipante';
import '../../App.css'
import { TipoServicio } from '../../Data/TipoServico';
import { Curso } from '../../Data/Curso';
import { CursoInforme } from '../../Data/CursoInforme';
import { ReactSession } from 'react-client-session';
import { Transaction } from '../../Data/zkt/Transaction';
import { Empresa } from '../../Data/Empresa';
import Spinner from '../../Spinner';
import { EmpresaReporte } from '../../Data/EmpresaReporte';
import { ReportesInformes } from '../../Data/informes/ReportesInformes';
import { TipoServicioInforme } from '../../Data/informes/TipoServicioInforme';
import { EmpresaInforme } from '../../Data/informes/EmpresaInforme';
import { PrestamosInforme } from '../../Data/informes/PrestamosInforme';
const Informes = () => {

    const handleChange = e => {
        const { name, value } = e.target;
        console.log(name)
        switch (name) {
            case "MarcaEquipo":
                setMarca(value);
                break;
            case "Cedula":
                setCedula(value);
                break;
            case "TipoDeServicio":
                setTiposervicio(value);
                break;
            case "Cursos":
                setCurso(value);
                break;
            default:
                break;
        }
        setTiposervicio(value);

    };
    const [fechaInicio, setFechaInicio] = useState(dayjs(new Date()));
    const [fechaFin, setFechaFin] = useState(dayjs(new Date()));
    const [tipoInforme, setTipoInforme] = useState("");
    const [tiposservicios, setTiposservicios] = useState([""]);
    const [herramientas, setHerramientas] = useState([""]);
    const [cursos, setCursos] = useState([""]);
    const [tiposervicio, setTiposervicio] = useState("");
    const [marca, setMarca] = useState("");
    const [curso, setCurso] = useState("");
    const [cedula, setCedula] = useState("");

    const handleDateIniciochange = (event) => {
        setFechaInicio(event.$d);
    }

    const handleDateFinchange = (event) => {
        setFechaFin(event.$d);
    }

    const handleChangeTipoInforme = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        console.log(name);
        console.log(value);
        if (value === "TipoServicio") {
            console.log("ntra")
            GetTipoServicios();
        }
        else if (value === "InformePrestamosComputador") {
            console.log("InformePrestamosComputador")
            GetMarcas();
        }
        else if (value === "Cursos") {
            console.log("Cursos")
            GetCursos();
        }
        setTipoInforme(value);
        console.log(tipoInforme)
    }

    const informeRegistro = () => {
        let participantes = [];
        fetch(
            ReactSession.get("basicUri") +
            "participante/getBetween/" + new Date(fechaInicio.toISOString()).getTime() + "/" + new Date(fechaFin.toISOString()).getTime(),
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
            }).then(() => {
                download(participantes, "Registro participantes");
            }).then(() => {
                setLoading(false);
            }).catch((error) =>{
                setLoading(false)
            });
    }

    const empresas = () => {
        let empresas = [];
        fetch(
            ReactSession.get("basicUri") +
            "visitavisitante/getByTimeAndEmpresa/" + new Date(fechaInicio.toISOString()).getTime() + "/" + new Date(fechaFin.toISOString()).getTime() + "/Todos",
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
                for (let pos = 0; pos < body.length; pos++) {
                    empresas.push(new EmpresaInforme(
                        body[pos]['TipoDocumentovisitante'],
                        body[pos]['Documentovisitante'],
                        body[pos]['nombres'],
                        body[pos]['apellidos'],
                        body[pos]['celular'],
                        body[pos]['email'],
                        body[pos]['nitEmpresa'],
                        body[pos]['nombreEmpresa'],
                        body[pos]['fechaHora'],
                        body[pos]['tratDatos']
                    ));
                }
            }).then(() => {
                download(empresas, "Informe empresas");
            }).then(() => {
                setLoading(false);
            }).catch((error) =>{
                setLoading(false)
            });
    }
    const informeTransacciones = () => {
        let transacciones = [];
        fetch(
            ReactSession.get("basicUri") +
            "visitavisitante/getByTime/" + new Date(fechaInicio.toISOString()).getTime() + "/" + new Date(fechaFin.toISOString()).getTime(),
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
                for (let pos = 0; pos < body.length; pos++) {
                    transacciones.push(new ReportesInformes(
                        body[pos]['TipoDocumentovisitante'],
                        body[pos]['Documentovisitante'],
                        body[pos]['nombres'],
                        body[pos]['apellidos'],
                        body[pos]['celular'],
                        body[pos]['email'],
                        body[pos]['nitEmpresa'],
                        body[pos]['nombreEmpresa'],
                        body[pos]['codigo'],
                        body[pos]['nombreEvento'],
                        body[pos]['nombreTipoServicio'],
                        body[pos]['descripcionTipoServicio'],
                        body[pos]['fechaHora'],
                        body[pos]['molinete'],
                        body[pos]['String tratDatos']
                    ));
                }
            }).then(() => {
                download(transacciones, "Informe transacciones");
            }).then(() => {
                setLoading(false);
            }).catch((error) =>{
                setLoading(false)
            });
    }

    const informeMarca = () => {

        let marcas = [];
        fetch(
            ReactSession.get("basicUri") +
            "visitavisitante/findByCreatedAtBetweenAndMarca/" + new Date(fechaInicio.toISOString()).getTime() + "/" + new Date(fechaFin.toISOString()).getTime() + "/" + marca,
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
                for (let pos = 0; pos < body.length; pos++) {
                    marcas.push(new PrestamosInforme(
                        body[pos]['TipoDocumentovisitante'],
                        body[pos]['Documentovisitante'],
                        body[pos]['nombres'],
                        body[pos]['apellidos'],
                        body[pos]['celular'],
                        body[pos]['email'],
                        body[pos]['marca'],
                        body[pos]['referencia'],
                        body[pos]['codigoBarras'],
                        body[pos]['estado'],
                        body[pos]['observacionPrestamo'],
                        body[pos]['observacionDevolucion'],
                        body[pos]['fechaPrestamo'],
                        body[pos]['fechaDevolucion']
                    ));
                }
            }).then(() => {
                download(marcas, "Informe marcas");
            }).then(() => {
                setLoading(false);
            }).catch((error) =>{
                setLoading(false)
            });

    }



    const informeTipoServicio = () => {

        let informeTipoServicio = [];
        fetch(
            ReactSession.get("basicUri") +
            "visitavisitante/getByTimeAndTipoServicio/" + new Date(fechaInicio.toISOString()).getTime() + "/" + new Date(fechaFin.toISOString()).getTime() + "/" + tiposervicio,
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
                for (let pos = 0; pos < body.length; pos++) {
                    informeTipoServicio.push(new TipoServicioInforme(
                        body[pos]['TipoDocumentovisitante'],
                        body[pos]['Documentovisitante'],
                        body[pos]['nombres'],
                        body[pos]['apellidos'],
                        body[pos]['celular'],
                        body[pos]['email'],
                        body[pos]['nombreTipoServicio'],
                        body[pos]['descripcionTipoServicio'],
                        body[pos]['fechaHora'],
                        body[pos]['tratDatos']
                    ));
                }
            }).then(() => {
                download(informeTipoServicio, "Informe tipo servicio");
            }).then(() => {
                setLoading(false);
            }).catch((error) =>{
                setLoading(false)
            });

    }

    const informeCursos = () => {

        let cursos = [];
        fetch(
            ReactSession.get("basicUri") +
            "visitavisitante/getByTimeAndCurso/" + new Date(fechaInicio.toISOString()).getTime() + "/" + new Date(fechaFin.toISOString()).getTime() + "/" + curso,
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
                for (let pos = 0; pos < body.length; pos++) {
                    cursos.push(new CursoInforme(
                        body[pos]['TipoDocumentovisitante'],
                        body[pos]['Documentovisitante'],
                        body[pos]['nombres'],
                        body[pos]['apellidos'],
                        body[pos]['celular'],
                        body[pos]['email'],
                        body[pos]['codigo'],
                        body[pos]['nombreEvento'],
                        body[pos]['fechaHora'],
                        body[pos]['tratDatos']
                    ));
                }
            }).then(() => {
                download(cursos, "Informe registro por eventos");
            }).then(() => {
                setLoading(false);
            }).catch((error) =>{
                setLoading(false)
            });

    }

    const traer = () => {
        setLoading(true);
        console.log(tipoInforme)
        if (tipoInforme === "InformeRegistro") {
            informeRegistro();
        }
        else if (tipoInforme === "InformePrestamosComputador") {
            informeMarca();
        }
        else if (tipoInforme === "TipoServicio") {
            informeTipoServicio();
        }
        else if (tipoInforme === "Cursos") {
            informeCursos();
        }
        else if (tipoInforme === "Transacciones") {
            informeTransacciones();
        }
        else if (tipoInforme === "Empresas") {
            empresas();
        }
    }

    const download = (data, name) => {
        let binaryParticipantes = XLSX.utils.json_to_sheet(data);
        var book = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(book, binaryParticipantes, 'Binary values')
        XLSX.writeFile(book, name + '.xlsx');
    }

    const GetTipoServicios = (data) => {
        fetch(
            ReactSession.get("basicUri") +
            "tiposervicio/getAll",
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
        ).then((response) => response.json())
            .then((json) => {
                console.log(json);
                ReactSession.set("token", json[0]);
                var body = json[1];
                console.log(body)
                let tiposServiciosJson = [];

                for (let pos = 0; pos < body.length; pos++) {
                    body[pos]['createdAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(body[pos]['createdAt']));
                    body[pos]['updatedAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(body[pos]['updatedAt']));
                    tiposServiciosJson.push(new TipoServicio(
                        body[pos]['id'],
                        body[pos]['nombre'],
                        body[pos]['descripcion'],
                        body[pos]['createdAt'],
                        body[pos]['updatedAt'],
                        body[pos]['form']));
                }
                setTiposservicios(tiposServiciosJson);
            })
    };

    const GetMarcas = (data) => {
        fetch(
            ReactSession.get("basicUri") +
            "herramienta/getAllMarcas",
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
        ).then((response) => response.json())
            .then((json) => {
                console.log(json);
                ReactSession.set("token", json[0]);
                var body = json[1];
                console.log(body);
                setHerramientas(body);
            })
    };

    const GetCursos = (data) => {
        fetch(
            ReactSession.get("basicUri") +
            "curso/getAll",
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
        ).then((response) => response.json())
            .then((json) => {
                console.log(json);
                ReactSession.set("token", json[0]);
                var body = json[1];
                console.log(body)
                let cursosJson = [];
                for (let pos = 0; pos < body.length; pos++) {
                    cursosJson.push(new Curso(
                        body[pos]['codigo'],
                        body[pos]['nombre'],));
                }
                setCursos(cursosJson);
            })
    };

    document.addEventListener("DOMContentLoaded", () => {
        const $codigo = document.querySelector("#codigo");
        $codigo.addEventListener("keydown", evento => {
            if (evento.keyCode === 13) {
                // El lector ya terminó de leer
                const codigoDeBarras = $codigo.value;
                // Aquí ya podemos hacer algo con el código. Yo solo lo imprimiré
                console.log("Tenemos un código de barras:");
                console.log(codigoDeBarras);
                // Limpiar el campo
                $codigo.value = "";
            }
        });
    });
    const [loading, setLoading] = useState(false);
    return (
        <div className="RegisterComponent">
            <Spinner open={loading} />
            <Box component="form" sx={{ mt: 1 }} className="cardout">

                <Typography variant="h4" align="Left" component="h4" gutterBottom>
                    Informes
                </Typography>

                <br />
                <Box component="form" sx={{ mt: 1 }} className="cardin">

                    <Stack direction="row" spacing={2} >

                        <Typography variant="h5" className="letrasInt" component="h5" spacing={2} className="letrasBlack">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tipo informe
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={8} className="letrasBlack">
                        <br />
                        <Select
                            required
                            id="Informe"
                            name="Informe"
                            value={tipoInforme}
                            onChange={handleChangeTipoInforme}
                            style={{ width: 300 }}
                        >
                            <MenuItem key="1" value="InformePrestamosComputador" width="300">Cantidad de prestamos por computador</MenuItem>
                            <MenuItem key="2" value="Cursos" width="300">Registro de personas por evento</MenuItem>
                            <MenuItem key="3" value="TipoServicio" width="300">Tipo servicio</MenuItem>
                            <MenuItem key="4" value="Transacciones" width="300">Entradas y salidas</MenuItem>
                            <MenuItem key="5" value="Empresas" width="300">Registro de empresas</MenuItem>
                        </Select>

                    </Stack>


                    <br />
                    {(tipoInforme === "ReporteEntradasSalidas")
                        ? (<>
                            <Stack direction="row" spacing={2} >

                                <Typography variant="h5" className="letrasInt" component="h5" spacing={2}>
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
                    {(tipoInforme === "InformePrestamosComputador")
                        ? (<>
                            <Stack direction="row" spacing={2} >

                                <Typography variant="h5" className="letrasInt" component="h5" spacing={2} className="letrasBlack">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Marca equipo
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={8}>
                                <br />
                                <Select
                                    required
                                    id="MarcaEquipo"
                                    name="MarcaEquipo"
                                    value={tiposervicio}
                                    onChange={handleChange}
                                    style={{ width: 300 }}
                                >
                                    <MenuItem key="Todas" value="Todas" width="300">Todas</MenuItem>
                                    {herramientas !== [""] && herramientas.map((element, index = element) => {
                                        return (
                                            <MenuItem key={index} value={element} width="300">{element}</MenuItem>

                                        );
                                    })}
                                </Select>
                            </Stack><br /></>) : ""}
                    {(tipoInforme === "TipoServicio")
                        ? (<>
                            <Stack direction="row" spacing={2} >

                                <Typography variant="h5" className="letrasInt" component="h5" spacing={2} className="letrasBlack">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tipo de servicio
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={8}>
                                <br />
                                <Select
                                    required
                                    id="TipoDeServicio"
                                    name="tiposervicio"
                                    value={tiposervicio}
                                    onChange={handleChange}
                                    style={{ width: 300 }}
                                >
                                    <MenuItem key="Todos" value="Todos" width="300">Todos</MenuItem>
                                    {tiposservicios !== [""] && tiposservicios.map((element, index = element.id) => {
                                        return (
                                            <MenuItem key={index} value={element.id} width="300">{element.nombre}</MenuItem>

                                        );
                                    })}
                                </Select>
                            </Stack><br /></>) : ""}
                    {(tipoInforme === "Cursos")
                        ? (<>
                            <Stack direction="row" spacing={2} >

                                <Typography variant="h5" className="letrasInt" component="h5" spacing={2} className="letrasBlack">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Evento
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={8}>
                                <br />
                                <Select
                                    required
                                    id="Cursos"
                                    name="Cursos"
                                    value={curso}
                                    onChange={handleChange}
                                    style={{ width: 300 }}
                                >
                                    <MenuItem key="Todos" value="Todos" width="300">Todos</MenuItem>
                                    {cursos !== [""] && cursos.map((element) => {
                                        return (
                                            <MenuItem key={element.codigo} value={element.codigo} width="300">{element.nombre}</MenuItem>

                                        );
                                    })}
                                </Select>
                            </Stack><br /></>) : ""}
                    <Stack direction="row" spacing={2} >

                        <Typography variant="h5" className="letrasInt" component="h5" spacing={2} className="letrasBlack">
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

                        <Typography variant="h5" className="letrasInt" component="h5" spacing={2} className="letrasBlack">
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
                        <Button class="button" variant="contained" endIcon={<SendIcon />} onClick={traer}>Descargar Informe</Button>

                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default Informes;
