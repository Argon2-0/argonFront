import { Box, FormControlLabel, TextField, Typography } from "@mui/material";
import React from "react";
import SendIcon from '@mui/icons-material/Send';
import './CrearVisitantes.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { TipoServicio } from "../../../Data/TipoServico";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import Switch from '@mui/material/Switch';
import '../../../App.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Participante } from "../../../Data/Participante";
import { Curso } from "../../../Data/Curso";
import { ReactSession } from 'react-client-session';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Spinner from "../../../Spinner";
const validPhoneRegex = RegExp(
    /((300|301|302|303|304|305|310|311|312|313|314|315|316|317|318|319|320|321|322|323|350|351)+([0-9]{7}))\b/i
);
const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};

class CrearVisitantes extends React.Component {
    constructor(props) {
        console.log(dayjs(new Date()));
        super(props);
        this.state = {
            id: "",
            checkTratDatos: false,
            tiposservicios: [""],
            cursos: [""],
            empresas: [""],
            curso: "",
            tipoDocumento: "",
            cedula: "",
            nombres: "",
            apellidos: "",
            celular: "",
            tiposervicio: "",
            tratDatos: "NO",
            tipoDocumentoZK: "",
            fechaInicio: dayjs(new Date()),
            fechaFin: dayjs(new Date()),
            empresaId: "",
            severity: "success",
            message: "",
            open: false,
            loading: false,
            errors: {
                curso: "",
                tipoDocumento: "",
                cedula: "",
                nombres: "",
                apellidos: "",
                celular: "",
                tiposervicio: "",
                tratDatos: "",
                tipoDocumentoZK: "",
                fechaInicio: "",
                fechaFin: "",
                empresa: ""
            }
        };
    }
    handleOpen = (severity, message) => {
        this.setState({
            open: true,
            severity,
            message,
        });
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            open: false,
        });
    };
    handleDateIniciochange = (event) => {
        this.setState({ "fechaInicio": event.$d })
    }
    handleDateFinchange = (event) => {
        this.setState({ "fechaFin": event.$d })
    }
    handleCheckchange = (event) => {
        if (event.target.checked) {

            this.setState({ "tratDatos": "SI", "checkTratDatos": true })
        }
        else {
            this.setState({ "tratDatos": "NO", "checkTratDatos": false })
        }
    }
    handleChange = (event) => {
        console.log(event)
        event.preventDefault();
        const { name, value } = event.target;
        this.validations(name, value);
    }
    handleChangeDocument = (event) => {


        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;
        this.validations(name, value).then(() => {
            console.log(this.state.tipoDocumento);
            console.log(this.state.cedula);
            if (validateForm(this.state.errors)) {
                console.log(this.state.tipoDocumento);
                console.log(this.state.cedula);
            }
            if (validateForm(this.state.errors) && this.state.cedula !== "") {
                let participante = "";

                fetch(
                    ReactSession.get("basicUri") +
                    "participante/getByCedula/" + this.state.cedula,
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
                        body['createdAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(body['createdAt']));
                        body['updatedAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(body['updatedAt']));

                        participante = new Participante(
                            body['id'],
                            body['tipoDocumento'],
                            body['cedula'],
                            body['nombres'],
                            body['apellidos'],
                            body['celular'],
                            body['email'],
                            body['tratDatos'],
                            body['estado'],
                            body['createdAt'],
                            body['updatedAt'],
                            body['tiposervicio']
                        );
                        console.log(body['tiposervicio'])
                        this.setState({ "participante": participante });
                        this.setState({ "id": body['id'] });
                        this.setState({ "tipoDocumento": body['tipoDocumento'] });
                        this.setState({ "nombres": body['nombres'] });
                        this.setState({ "apellidos": body['apellidos'] });
                        this.setState({ "celular": body['celular'] });
                        this.setState({ "tratDatos": body['tratDatos'] });
                        if (body['tiposervicio'] !== null) {
                            this.setState({ "tiposervicio": (body['tiposervicio'])['id'] });
                        } else {
                            fetch(
                                ReactSession.get("basicUri") +
                                "visitantecurso/getByVisitante/" + this.state.id,
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
                                .then((jsonCurso) => {
                                    ReactSession.set("token", json[0]);
                                    var bodyCurso = jsonCurso[1];
                                    this.setState({ "curso": bodyCurso['cursoCodigo'] });
                                })
                        }
                        if (body['tratDatos'] === "SI") {
                            this.setState({ "checkTratDatos": true });
                        }
                        else {
                            this.setState({ "checkTratDatos": false });
                        }

                    }).catch((reason) => {
                        console.log(reason);
                        this.setState({ "id": '' });

                    }).then(() => {
                        console.log(errors);
                        this.setState({ errors });
                    })
            }
        });


    }

    setClickOnDocumento = (e) => {
        console.log("documento")
        this.setState({ 'actual': "documento" });
    }

    validations = (name, value) => {
        let errors = this.state.errors;
        switch (name) {
            case 'tipoDocumento': {
                console.log(value)
                switch (value) {
                    case 'C.C':
                        this.setState({ "tipoDocumentoZK": 2000 });
                        break;
                    case 'C.E':
                        this.setState({ "tipoDocumentoZK": 2002 });
                        break;
                    case 'Registro único tributario':
                        this.setState({ "tipoDocumentoZK": 8 });
                        break;
                    case 'Registro civil':
                        this.setState({ "tipoDocumentoZK": 8 });
                        break;
                    case 'Numero identificación tributaria':
                        this.setState({ "tipoDocumentoZK": 8 });
                        break;
                    case 'Pasaporte':
                        this.setState({ "tipoDocumentoZK": 3 });
                        break;
                    case 'T.I':
                        this.setState({ "tipoDocumentoZK": 2001 });
                        break;
                    case 'Permiso de permanencia':
                        this.setState({ "tipoDocumentoZK": 2004 });
                        break;
                    case 'NIT':
                        this.setState({ "tipoDocumentoZK": 8 });
                        break;
                    case 'Desconocido':
                        this.setState({ "tipoDocumentoZK": 8 });
                        break;
                    default:
                        break;

                };
                errors.tipoDocumento =
                    value === ""
                        ? 'Should select a document type!'
                        : ''
                break;
            }
            case 'cedula':
                errors.cedula =
                    value.length < 5
                        ? 'Id must be at least 5 characters long!'
                        : '';
                break;
            case 'nombres':
                errors.nombres =
                    value.length < 2
                        ? 'Nombres must be at least 2 characters long!'
                        : '';
                break;
            case 'apellidos':
                errors.apellidos =
                    value.length < 2
                        ? 'Id must be at least 2 characters long!'
                        : '';
                break;
            case 'celular':
                errors.celular =
                    validPhoneRegex.test(value)
                        ? ''
                        : 'Numero de celular no valido';
                break;
            case 'tiposervicio':
                if (this.state.curso === "" && value === "") {
                    errors.tiposervicio = 'Debe escoger un curso o servicio';
                } else if (this.state.curso !== "" && value !== "") {
                    errors.tiposervicio = 'Debe escoger un curso o servicio pero no ambos';
                } else {
                    errors.tiposervicio = '';
                    errors.curso = '';
                }
                break;
            case 'fechaInicio':
                errors.fechaInicio =
                    value === ""
                        ? 'Should select a start date!'
                        : '';
                break;
            case 'fechaFin':
                errors.fechaFin =
                    value === ""
                        ? 'Should select a end date!'
                        : '';
                break;

            case 'curso':
                if (this.state.tiposervicio === "" && value === "") {
                    errors.curso = 'Debe escoger un curso o servicio';
                } else if (this.state.tiposervicio !== "" && value !== "") {
                    errors.curso = 'Debe escoger un curso o servicio pero no ambos';
                } else {
                    errors.curso = '';
                    errors.tiposervicio = '';
                }
                break;
            default:
                break;
        }
        return Promise.resolve(this.setState({ errors, [name]: value }));


    }

    handleSubmit = (e) => {
        this.setState({ loading: true })
        const fields = ["tipoDocumento", "cedula", "nombres", "apellidos", "celular", "tiposervicio", "tratDatos", "curso"];
        fields.forEach(field => {
            this.validations(field, this.state[field]);
        });
        if (validateForm(this.state.errors)) {
            console.info('Valid Form')
            if (ReactSession.get("idRol") === 1 || ReactSession.get("idRol") === 2 || ReactSession.get("idRol") === 3) {
                console.log(this.state.id);
                if (this.state.id === "") {
                    console.log("a")
                    if (this.state.tiposervicio === "") {
                        console.log("ab")
                        fetch(ReactSession.get("basicUri") + "participante/create", {
                            mode: "cors",
                            method: "POST",
                            body: JSON.stringify({
                                tipoDocumento: this.state.tipoDocumento,
                                cedula: this.state.cedula,
                                nombres: this.state.nombres,
                                apellidos: this.state.apellidos,
                                tratDatos: this.state.tratDatos,
                                celular: this.state.celular,
                                tiposervicio: null,
                                createdAt: Date.now(),

                            }),
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': ReactSession.get("token"),
                                "LastTime": ReactSession.get("lastTime"),
                                "CurrentTime": ReactSession.get("currentTime"),
                                "id": ReactSession.get("idRol"),
                            },
                        }).then((response) => response.json())
                            .then((json) => {
                                this.zktEventoRegistro(json);
                            }).finally(() => {
                                this.setState({ loading: false })
                            })
                    } else {
                        console.log("ba")
                        fetch(ReactSession.get("basicUri") + "participante/create", {
                            mode: "cors",
                            method: "POST",
                            body: JSON.stringify({
                                tipoDocumento: this.state.tipoDocumento,
                                cedula: this.state.cedula,
                                nombres: this.state.nombres,
                                apellidos: this.state.apellidos,
                                tratDatos: this.state.tratDatos,
                                celular: this.state.celular,
                                tiposervicio: {
                                    id: this.state.tiposervicio,
                                },
                                createdAt: Date.now(),

                            }),
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': ReactSession.get("token"),
                                "LastTime": ReactSession.get("lastTime"),
                                "CurrentTime": ReactSession.get("currentTime"),
                                "id": ReactSession.get("idRol"),
                            },
                        }).then((response) => response.json())
                            .then((json) => {
                                this.zktEventoRegistro(json);
                            }).finally(() => {
                                this.setState({ loading: false })
                            })
                    }
                } else {
                    console.log("b")
                    if (this.state.tiposervicio === "") {
                        console.log("ba")
                        fetch(ReactSession.get("basicUri") + "participante/update", {
                            mode: "cors",
                            method: "POST",
                            body: JSON.stringify({
                                id: this.state.id,
                                tipoDocumento: this.state.tipoDocumento,
                                cedula: this.state.cedula,
                                nombres: this.state.nombres,
                                apellidos: this.state.apellidos,
                                tratDatos: this.state.tratDatos,
                                celular: this.state.celular,
                                tiposervicio: null,
                                createdAt: Date.now(),

                            }),
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': ReactSession.get("token"),
                                "LastTime": ReactSession.get("lastTime"),
                                "CurrentTime": ReactSession.get("currentTime"),
                                "id": ReactSession.get("idRol"),
                            },
                        }).then((response) => response.json())
                            .then((json) => {
                                this.zktEventoRegistro(json);
                            }).finally(() => {
                                this.setState({ loading: false })
                            })
                    } else {
                        console.log("bb")
                        fetch(ReactSession.get("basicUri") + "participante/update", {
                            mode: "cors",
                            method: "POST",
                            body: JSON.stringify({
                                id: this.state.id,
                                tipoDocumento: this.state.tipoDocumento,
                                cedula: this.state.cedula,
                                nombres: this.state.nombres,
                                apellidos: this.state.apellidos,
                                tratDatos: this.state.tratDatos,
                                celular: this.state.celular,
                                tiposervicio: {
                                    id: this.state.tiposervicio,
                                },
                                createdAt: Date.now(),
                            }),
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': ReactSession.get("token"),
                                "LastTime": ReactSession.get("lastTime"),
                                "CurrentTime": ReactSession.get("currentTime"),
                                "id": ReactSession.get("idRol"),
                            },
                        }).then((response) => response.json())
                            .then((json) => {
                                this.zktEventoRegistro(json);
                            }).finally(() => {
                                this.setState({ loading: false })
                            })
                    }
                }
            } else {
                this.setState({ loading: false })
                this.handleOpen('warning', 'No tiene permisos para crear un visitante')
            }

        } else {
            this.setState({ loading: false })
            console.error('Invalid Form')
            this.handleOpen('error', 'Hubo un problema al crear el visitante')
        }
    };


    zktEventoRegistro = (json) => {
        console.log(json);
        ReactSession.set("token", json[0]);
        fetch(ReactSession.get("basicUri") + "zkt/persona/create", {
            mode: "cors",
            method: "POST",
            body: JSON.stringify({
                carPlate: this.state.cedula,
                cardNo: this.state.cedula,
                certNumber: this.state.cedula,
                certType: this.state.tipoDocumentoZK,
                lastName: this.state.apellidos,
                mobilePhone: this.state.celular,
                name: this.state.nombres,
                pin: this.state.cedula,
                accStartTime: new Date(new dayjs(this.state.fechaInicio.toISOString().toString().split("T")[0]).toISOString()).getTime(),
                accEndTime: new Date(new dayjs(this.state.fechaFin.toISOString().toString().split("T")[0]).toISOString()).getTime()


            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': ReactSession.get("token"),
                "LastTime": ReactSession.get("lastTime"),
                "CurrentTime": ReactSession.get("currentTime"),
                "id": ReactSession.get("idRol")
            },
        }).then((response) => response.json())
            .then((json) => {
                if (this.state.curso !== "") {
                    console.log(json);
                    ReactSession.set("token", json[0]);
                    fetch(ReactSession.get("basicUri") + "participante/getByCedula/" + this.state.cedula, {
                        mode: "cors",
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': ReactSession.get("token"),
                            "LastTime": ReactSession.get("lastTime"),
                            "CurrentTime": ReactSession.get("currentTime"),
                            "id": ReactSession.get("idRol")
                        },
                    }).then((responserequest) => responserequest.json())
                        .then((jsonrequest) => {
                            console.log(jsonrequest)
                            console.log((jsonrequest[1])['id'])
                            console.log(this.state.fechaInicio)
                            console.log(this.state.fechaFin)
                            fetch(ReactSession.get("basicUri") + "visitantecurso/create", {
                                mode: "cors",
                                method: "POST",
                                body: JSON.stringify({
                                    visitanteId: (jsonrequest[1])['id'],
                                    cursoCodigo: this.state.curso,
                                    diaInicio: this.state.fechaInicio.toISOString().toString().split("T")[0],
                                    diaFin: this.state.fechaFin.toISOString().toString().split("T")[0],
                                }),
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
                                    this.handleOpen('success', 'El visitante fue creado')
                                    this.setState({
                                        checkTratDatos: false,
                                        tiposservicios: [""],
                                        cursos: [""],
                                        empresas: [""],
                                        curso: "",
                                        tipoDocumento: "",
                                        cedula: "",
                                        nombres: "",
                                        apellidos: "",
                                        celular: "",
                                        tiposervicio: "",
                                        tratDatos: "NO",
                                        tipoDocumentoZK: "",
                                        fechaInicio: dayjs(new Date()),
                                        fechaFin: dayjs(new Date()),
                                        empresaId: "",
                                    })
                                }).finally(() => {
                                    this.setState({ loading: false })
                                })
                        }).finally(() => {
                            this.setState({ loading: false })
                        })
                } else {
                    this.setState({ loading: false })
                    console.log(json);
                    ReactSession.set("token", json[0]);
                    this.handleOpen('success', 'El visitante fue creado')
                    this.setState({
                        checkTratDatos: false,
                        tiposservicios: [""],
                        cursos: [""],
                        empresas: [""],
                        curso: "",
                        tipoDocumento: "",
                        cedula: "",
                        nombres: "",
                        apellidos: "",
                        celular: "",
                        tiposervicio: "",
                        tratDatos: "NO",
                        tipoDocumentoZK: "",
                        fechaInicio: dayjs(new Date()),
                        fechaFin: dayjs(new Date()),
                        empresaId: "",
                    })
                }
            }).catch((reason) => {
                this.setState({ loading: false })
                this.handleOpen('error', 'Hubo un problema al crear el visitante')
            }).finally(() => {
                this.setState({ loading: false })
            })
    }

    componentDidMount() {
        fetch(
            ReactSession.get("basicUri") +
            "tiposervicio/getAllByDisponible/si",
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
                this.setState({ "tiposservicios": tiposServiciosJson });
            })
            .then(() => {
                fetch(
                    ReactSession.get("basicUri") +
                    "curso/getAllByDisponible/si",
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
                        this.setState({ "cursos": cursosJson });
                    })
            })
    };
    render() {
        const { errors } = this.state;
        return (
            <div className="sizer">
                <Spinner open={this.state.loading} />
                <Box className="cardout">
                    <center>
                        <Typography variant="h4" component="h4" gutterBottom>
                            Crear Visitante
                        </Typography>
                    </center>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Box >
                                            <Typography variant="h5" align="center" component="h5" gutterBottom className="letras">
                                                Información del visitante
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }} className="cardin">
                                            <TableContainer>
                                                <Table>

                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h5" className="letrasInt" component="h5" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tipo de documento
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <Select
                                                                        required
                                                                        id="TipoDeDocumento"
                                                                        name="tipoDocumento"
                                                                        value={this.state.tipoDocumento}
                                                                        onChange={this.handleChangeDocument}
                                                                        style={{ width: 300 }}
                                                                    >
                                                                        <MenuItem key="C.C" value="C.C" width="300">Cédula de ciudadania</MenuItem>
                                                                        <MenuItem key="C.E" value="C.E" width="300">Cédula de extranjeria</MenuItem>
                                                                        <MenuItem key="Registro único tributario" value="Registro único tributario" width="300">Registro único tributario</MenuItem>
                                                                        <MenuItem key="Registro civil" value="Registro civil" width="300">Registro civil</MenuItem>
                                                                        <MenuItem key="Numero identificación tributaria" value="Numero identificación tributaria" width="300">Numero identificación tributaria</MenuItem>
                                                                        <MenuItem key="Pasaporte" value="Pasaporte" width="300">Pasaporte</MenuItem>
                                                                        <MenuItem key="T.I" value="T.I" width="300">Tarjeta de identidad</MenuItem>
                                                                        <MenuItem key="Permiso de permanencia" value="Permiso de permanencia" width="300">Permiso especial de permanencia</MenuItem>
                                                                        <MenuItem key="NIT" value="NIT" width="300">NIT</MenuItem>
                                                                        <MenuItem key="Desconocido" value="Desconocido" width="300">Desconocido</MenuItem>
                                                                    </Select>

                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.tipoDocumento.length > 0 &&
                                                                        <span className='error'>{errors.tipoDocumento}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h5" className="letrasInt" component="h5" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Numero de documento
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="Cedula"
                                                                        name="cedula"
                                                                        value={this.state.cedula}
                                                                        onChange={this.handleChangeDocument}
                                                                        style={{ width: 300 }}
                                                                        noValidate
                                                                        onClick={this.setClickOnDocumento}
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.cedula.length > 0 &&
                                                                        <span className='error'>{errors.cedula}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h5" className="letrasInt" component="h5" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nombres
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="Nombres"
                                                                        name="nombres"
                                                                        value={this.state.nombres}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                        noValidate
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.nombres.length > 0 &&
                                                                        <span className='error'>{errors.nombres}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>

                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h5" className="letrasInt" component="h5" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Apellidos
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="Apellidos"
                                                                        name="apellidos"
                                                                        value={this.state.apellidos}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                        noValidate
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.apellidos.length > 0 &&
                                                                        <span className='error'>{errors.apellidos}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h5" className="letrasInt" component="h5" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Celular
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="Celular"
                                                                        name="celular"
                                                                        value={this.state.celular}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    />

                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.celular.length > 0 &&
                                                                        <span className='error'>{errors.celular}</span>}
                                                                </Stack>

                                                            </TableCell>

                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h5" className="letrasInt" component="h5" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tipo de servicio
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <Select
                                                                        required
                                                                        id="TipoDeServicio"
                                                                        name="tiposervicio"
                                                                        value={this.state.tiposervicio}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    >
                                                                        <MenuItem key="default" value="" width="300">Seleccione un tipo de servicio</MenuItem>
                                                                        if(this.state.tiposservicios !== [""]){
                                                                            this.state.tiposservicios?.map((element, index = element?.id) => {
                                                                                return (
                                                                                    <MenuItem key={index} value={element?.id} width="300">{element?.nombre}</MenuItem>

                                                                                );
                                                                            })}
                                                                    </Select>

                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.tiposervicio.length > 0 &&
                                                                        <span className='error'>{errors.tiposervicio}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>


                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h5" className="letrasInt" component="h5" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Evento
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <Select
                                                                        required
                                                                        id="curso"
                                                                        name="curso"
                                                                        value={this.state.curso}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    >
                                                                        <MenuItem key="default" value="" width="300">Seleccione un evento</MenuItem>
                                                                        if(this.state.cursos !== [""]){
                                                                            this.state.cursos?.map((element) => {
                                                                                return (
                                                                                    <MenuItem key={element?.codigo} value={element?.codigo} width="300">{element?.nombre}</MenuItem>

                                                                                );
                                                                            })}
                                                                    </Select>

                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.curso.length > 0 &&
                                                                        <span className='error'>{errors.curso}</span>}
                                                                </Stack>
                                                            </TableCell>


                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h5" className="letrasInt" component="h5" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fecha de inicio
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <DatePicker
                                                                        required
                                                                        autoOk={true}
                                                                        id="fechaInicio"
                                                                        name="fechaInicio"
                                                                        value={this.state.fechaInicio}
                                                                        onChange={this.handleDateIniciochange}
                                                                        style={{ width: 300 }}
                                                                        noValidate
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.fechaInicio.length > 0 &&
                                                                        <span className='error'>{errors.fechaInicio}</span>}
                                                                </Stack>

                                                            </TableCell>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h5" className="letrasInt" component="h5" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fecha de fin
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <DatePicker
                                                                        required
                                                                        autoOk={true}
                                                                        id="fechaFin"
                                                                        name="fechaFin"
                                                                        value={this.state.fechaFin}
                                                                        onChange={this.handleDateFinchange}
                                                                        style={{ width: 300 }}
                                                                        noValidate
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.fechaFin.length > 0 &&
                                                                        <span className='error'>{errors.fechaFin}</span>}
                                                                </Stack>

                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell></TableCell>

                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h5" className="letrasInt" component="h5" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Autoriza tratamiento de datos
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Switch
                                                                                id="TratamientoDeDatos"
                                                                                name="tratDatos"
                                                                                checked={this.state.checkTratDatos}
                                                                                onChange={this.handleCheckchange}
                                                                                style={{ width: 300 }}

                                                                            />
                                                                        }
                                                                        label={this.state.tratDatos}
                                                                    />

                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.tratDatos.length > 0 &&
                                                                        <span className='error'>{errors.tratDatos}</span>}
                                                                </Stack>
                                                                <br />

                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>

                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box textAlign='center'>
                        <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={this.handleSubmit}>Crear visitante</Button>

                    </Box>
                </Box>
                <Snackbar
                    open={this.state.open}
                    autoHideDuration={10000} // milliseconds
                    onClose={this.handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <MuiAlert
                        onClose={this.handleClose}
                        severity={this.state.severity}
                        elevation={6}
                        variant="filled"
                        sx={{
                            width: '100%',
                            fontSize: '1.2rem',
                            '& .MuiAlert-icon': {
                                fontSize: '2rem',
                            },
                        }}
                    >

                        <div>
                            {this.state.severity === "success" && (
                                <img
                                    src="/images/poptorniqute.png"
                                    style={{ width: '100%', height: 'auto' }}
                                    alt="Success Image"
                                />
                            )}

                            {this.state.message}
                        </div>

                    </MuiAlert>
                </Snackbar>
            </div >
        );
    }
};

export default CrearVisitantes;
