import { Box, TextField, Typography } from "@mui/material";
import React from "react";
import SendIcon from '@mui/icons-material/Send';
import './PrestarComputadores.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { TipoServicio } from "../../../Data/TipoServico";
import dayjs from "dayjs";
import { Participante } from "../../../Data/Participante";
import { Herramienta } from "../../../Data/Herramienta";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import '../../../App.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { ReactSession } from 'react-client-session';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};

class PrestarComputadores extends React.Component {
    constructor(props) {
        console.log(dayjs(new Date()));
        super(props);
        this.state = {
            id: "",
            actual: "",
            stopStream: false,
            participante: "",
            tipoDocumento: "",
            cedula: "",
            nombres: "",
            apellidos: "",
            celular: "",
            CodigoDeBarras: "",
            herramienta: "",
            Observacion: "",
            severity: "success",
            message: "",
            open: false,
            errors: {
                tipoDocumento: "",
                cedula: "",
                nombres: "",
                apellidos: "",
                fechaNacimiento: "",
                celular: "",
                tiposervicio: "",
                tratDatos: "",
                CodigoDeBarras: "",
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

    handleDatechange = (event, date) => {
        this.setState({ "fechaNacimiento": date })
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
            if (validateForm(this.state.errors) && this.state.tipoDocumento !== "" && this.state.cedula !== "") {
                let participante = "";

                fetch(
                    ReactSession.get("basicUri") +
                    "participante/getByTipoDocumentoAndCedula/" + this.state.tipoDocumento + "/" + this.state.cedula,
                    {
                        mode: "cors",
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': ReactSession.get("token"),
                            "LastTime": ReactSession.get("lastTime"),
                            "CurrentTime": ReactSession.get("currentTime")
                        },
                    }
                )
                    .then((response) => response.json())
                    .then((json) => {
                        console.log(json);
                        ReactSession.set("token", json[0]);
                        var body = json[1];
                        console.log(body)
                        console.log(json);

                        if (body['fechaNacimiento'] != null) {
                            body['fechaNacimiento'] = (body['fechaNacimiento'])[2] + "/" + (body['fechaNacimiento'])[1] + "/" + (body['fechaNacimiento'])[0];
                        }
                        body['createdAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(body['createdAt']));
                        body['updatedAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(body['updatedAt']));

                        participante = new Participante(
                            body['id'],
                            body['tipoDocumento'],
                            body['cedula'],
                            body['nombres'],
                            body['apellidos'],
                            0,
                            body['celular'],
                            body['sexo'],
                            body['email'],
                            body['curso'],
                            body['tratDatos'],
                            body['estado'],
                            body['createdAt'],
                            body['updatedAt'],
                            body['tiposervicio']
                        );
                        return Promise.resolve(this.setState({ "participante": participante, "id": body['id'], "nombres": body['nombres'], "apellidos": body['apellidos'], "celular": body['celular'] }));

                    }).then((response) => {
                        if (validateForm(this.state.errors) && this.state.tipoDocumento !== "" && this.state.cedula !== "") {
                            let errors = this.state.errors;
                            fetch(
                                ReactSession.get("basicUri") +
                                "herramientaparticipante/getByParticipanteIdAndEstado/" + this.state.tipoDocumento + "/" + this.state.cedula + "/Préstado",
                                {
                                    mode: "cors",
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        'Authorization': ReactSession.get("token"),
                                        "LastTime": ReactSession.get("lastTime"),
                                        "CurrentTime": ReactSession.get("currentTime")
                                    },
                                }
                            )
                                .then((response) => response.json())
                                .then((json) => {
                                    console.log(json);
                                    ReactSession.set("token", json[0]);
                                    var body = json[1];
                                    console.log(body)
                                    if (body === 0) {
                                        errors.cedula = '';
                                    }
                                    else { errors.cedula = 'La persona ya tiene un dispositivo prestado'; }

                                }).then(() => {
                                    console.log(errors);
                                    this.setState({ errors });
                                })
                        }
                    }).then().catch((reason) => {
                        console.log(reason);
                        errors.cedula = 'El documento no existe';
                        this.setState({ "participante": '' });
                        this.setState({ "nombres": '' });
                        this.setState({ "apellidos": '' });
                        this.setState({ "celular": '' });


                    }).then(() => {
                        console.log(errors);
                        this.setState({ errors });
                    })
            }
        })

    }

    handleChangeCodigoBarras = (event) => {

        const { name, value } = event.target;
        event.preventDefault();
        let errors = this.state.errors;
        let herramienta = "";
        this.validations(name, value);
        fetch(

            ReactSession.get("basicUri") +
            "herramienta/getByCodigoBarras/" + value,
            {
                mode: "cors",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': ReactSession.get("token"),
                    "LastTime": ReactSession.get("lastTime"),
                    "CurrentTime": ReactSession.get("currentTime")
                },
            }
        )
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                ReactSession.set("token", json[0]);
                var body = json[1];
                console.log(body)
                console.log(json)
                body['createdAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(body['createdAt']));
                body['updatedAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(body['updatedAt']));

                herramienta = new Herramienta(
                    body['id'],
                    body['nombre'],
                    body['descripcion'],
                    body['marca'],
                    body['serial'],
                    body['codigoBarras'],
                    body['estado'],
                    body['createdAt'],
                    body['updatedAt'],
                    body['participante'],
                );
            }).then(() => {
                errors.CodigoDeBarras = '';
                this.validations(name, value);
                this.setState({ errors, 'herramienta': herramienta });
                fetch(
                    ReactSession.get("basicUri") +
                    "herramientaparticipante/getByHerramientaIdAndEstado/" + herramienta.id + "/Préstado",
                    {
                        mode: "cors",
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': ReactSession.get("token"),
                            "LastTime": ReactSession.get("lastTime"),
                            "CurrentTime": ReactSession.get("currentTime")
                        },
                    }
                ).then((response) => response.json())
                    .then((json) => {
                        console.log(json);
                        ReactSession.set("token", json[0]);
                        console.log(json);
                        errors.CodigoDeBarras = 'El equipo se encuentra préstado';
                        this.validations(name, value);
                        this.setState({ errors });
                    }).catch((reason) => {
                        console.log(reason);
                        errors.CodigoDeBarras = '';
                    }).then(() => {
                        console.log(errors);
                        this.validations(name, value);
                        this.setState({ errors });
                    });

            }).catch((reason) => {
                console.log(reason);
                errors.CodigoDeBarras = 'El codigo de barras no existe';

            }).then(() => {
                console.log(errors);
                this.validations(name, value);
                this.setState({ errors });
            });



    }

    setStopStream = (e) => {
        this.setState({ 'stopStream': true });
    }

    setClickOnDocumento = (e) => {
        console.log("documento")
        this.setState({ 'actual': "documento" });
    }

    setClickOnCodigoBarras = (e) => {
        console.log("codigoBarras")
        this.setState({ 'actual': "codigoBarras" });
    }

    validations = (name, value) => {
        let errors = this.state.errors;
        switch (name) {
            case 'tipoDocumento':
                errors.tipoDocumento =
                    value === ""
                        ? 'Should select a document type!'
                        : '';
                break;
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
            case 'fechaNacimiento':
                errors.fechaNacimiento =
                    value === ""
                        ? 'Should select a birth date!'
                        : '';
                break;
            case 'tiposervicio':
                errors.tiposervicio =
                    value === ""
                        ? 'Tipo servicio select a document type!'
                        : '';
                break;
            default:
                break;
        }

        return Promise.resolve(this.setState({ errors, [name]: value }));
    }

    handleSubmit = (e) => {
        const fields = ["tipoDocumento", "cedula", "nombres", "apellidos", "fechaNacimiento", "celular", "tiposervicio", "tratDatos"];
        e.preventDefault();
        fields.forEach(field => {
            this.validations(field, this.state[field]);
        });
        if (validateForm(this.state.errors)) {
            console.info('Valid Form')
            fetch(ReactSession.get("basicUri") + "herramientaparticipante/create", {
                mode: "cors",
                method: "POST",
                body: JSON.stringify({
                    participante: this.state.participante,
                    herramienta: this.state.herramienta,
                    observacionSalida: this.state.Observacion,
                    estado: 'Préstado',
                    createdAt: Date.now()

                }),
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': ReactSession.get("token"),
                    "LastTime": ReactSession.get("lastTime"),
                    "CurrentTime": ReactSession.get("currentTime")
                },
            }).then((response) => response.json())
                .then((json) => {
                    console.log(json);
                    ReactSession.set("token", json[0]);
                    fetch(ReactSession.get("basicUri") + "zkt/persona/updatePrestamo/" + this.state.cedula, {
                        mode: "cors",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': ReactSession.get("token"),
                            "LastTime": ReactSession.get("lastTime"),
                            "CurrentTime": ReactSession.get("currentTime")
                        },
                    }).then((response) => response.json())
                        .then((json) => {
                            console.log(json);
                            ReactSession.set("token", json[0]);
                            this.handleOpen('success', 'El computador fue prestado')
                            this.setState({
                                id: "",
                                actual: "",
                                stopStream: false,
                                participante: "",
                                tipoDocumento: "",
                                cedula: "",
                                nombres: "",
                                apellidos: "",
                                celular: "",
                                CodigoDeBarras: "",
                                herramienta: "",
                                Observacion: "",
                            })
                        })
                });
        } else {
            console.error('Invalid Form')
            this.handleOpen('error', 'Hubo un problema al prestar el computador')
        }
    };


    
    render() {
        const { errors } = this.state;
        return (
            <div className="sizer">

                <Box className="cardout">
                    <Typography variant="h4" component="h4" gutterBottom>
                        Prestar Computador
                    </Typography>
                    <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }} className="cardin">
                        <BarcodeScannerComponent
                            width={0}
                            height={0}
                            stopStream={this.state.stopStream}
                            onUpdate={(err, result) => {
                                console.log(result)
                                if (result) {
                                    console.log("Cedula")
                                } else {
                                    console.log("Not Found");
                                }
                            }}
                        />

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="h5" align="center" component="h5" gutterBottom >
                                                    Información del solicitante
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="h5" align="center" component="h5" gutterBottom >
                                                    Información del equipo
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} >

                                                <Typography variant="h6" component="h6" spacing={2}>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tipo de documento
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                <Select
                                                    required
                                                    id="TipoDeDocumento"
                                                    name="tipoDocumento"
                                                    key={this.state.tipoDocumento}
                                                    value={this.state.tipoDocumento}
                                                    onChange={this.handleChangeDocument}
                                                    style={{ width: 300 }}
                                                    variant="filled"

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

                                                <Typography variant="h6" component="h6" spacing={2}>
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

                                                <Typography variant="h6" component="h6" spacing={2}>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Código de barras
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                <TextField
                                                    required
                                                    id="CodigoDeBarras"
                                                    name="CodigoDeBarras"
                                                    value={this.state.CodigoDeBarras}
                                                    onChange={this.handleChangeCodigoBarras}
                                                    style={{ width: 300 }}
                                                    onClick={this.setClickOnCodigoBarras}
                                                />

                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                {errors.CodigoDeBarras.length > 0 &&
                                                    <span className='error'>{errors.CodigoDeBarras}</span>}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} >

                                                <Typography variant="h6" component="h6" spacing={2}>
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
                                                    disabled
                                                    variant="filled"
                                                />
                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                {errors.nombres.length > 0 &&
                                                    <span className='error'>{errors.nombres}</span>}
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Stack direction="row" spacing={2} >

                                                <Typography variant="h6" component="h6" spacing={2}>
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
                                                    disabled
                                                    variant="filled"
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

                                                <Typography variant="h6" component="h6" spacing={2}>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Observación
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                <TextField
                                                    required
                                                    id="Observacion"
                                                    name="Observacion"
                                                    value={this.state.Observacion}
                                                    onChange={this.handleChange}
                                                    style={{ width: 300 }}
                                                    noValidate
                                                />
                                            </Stack>
                                        </TableCell>



                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} >

                                                <Typography variant="h6" component="h6" spacing={2}>
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
                                                    disabled
                                                    variant="filled"
                                                />

                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                {errors.celular.length > 0 &&
                                                    <span className='error'>{errors.celular}</span>}
                                            </Stack>

                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>


                </Box>
                <Box textAlign='center'>
                    <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={this.handleSubmit}>Confirmar Préstamo</Button>

                </Box>
                <Snackbar
                    open={this.state.open}
                    autoHideDuration={6000} // milliseconds
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
                        {this.state.message}
                    </MuiAlert>
                </Snackbar>
            </div>
        );
    }
};

export default PrestarComputadores;
