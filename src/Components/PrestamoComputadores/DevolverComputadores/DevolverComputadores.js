import React from 'react'
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { Box, Stack, TextField } from '@mui/material';
import './DevolverComputadores.css'
import Button from '@mui/material/Button';
import { Herramienta } from '../../../Data/Herramienta';
import { HerramientaParticipante } from '../../../Data/HerramientaParticipante';
import '../../../App.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { ReactSession } from 'react-client-session';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Spinner from '../../../Spinner';
const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};

class DevolverComputadores extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CodigoDeBarras: "",
            herramienta: "",
            herramientaParticipante: "",
            Observacion: "",
            severity: "success",
            message: "",
            open: false,
            loading: false,
            participante: "",
            herramienta: "",
            cedula:"",
            errors: {
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

    handleChange = (event) => {
        console.log(event)
        event.preventDefault();
        const { name, value } = event.target;
        this.validations(name, value);
    }

    handleChangeCodigoBarras = (event) => {
        const { name, value } = event.target;
        event.preventDefault();
        let errors = this.state.errors;
        let herramienta = "";
        var herramientaParticipante;
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
                        console.log(json)
                        herramientaParticipante = new HerramientaParticipante(
                            body['id'],
                            body['observacionSalida'],
                            body['observacionEntrada'],
                            body['estado'],
                            body['totHoras'],
                            body['createdAt'],
                            body['updatedAt'],
                            body['participante'],
                            body['herramienta'],
                        );
                        this.setState({"participante": body['participante']})
                        this.setState({"herramienta": body['herramienta']})
                        this.setState({"cedula": (body['participante'])["cedula"]})
                        console.log(json);
                        errors.CodigoDeBarras = '';

                    }).then(() => {
                        this.setState({ errors, "herramientaParticipante": herramientaParticipante });
                    }).catch((reason) => {
                        console.log(reason);
                        errors.CodigoDeBarras = 'El equipo no se encuentra préstado';
                    }).then(() => {
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

    validations = (name, value) => {
        let errors = this.state.errors;

        this.setState({ errors, [name]: value });

    }

    handleSubmit = (e) => {
        this.setState({loading: true})
        e.preventDefault();
        console.log(this.state.herramientaParticipante);
        console.log(this.state.participante)
        console.log(this.state.cedula)
        if (validateForm(this.state.errors)) {
            if (ReactSession.get("idRol") === 1 || ReactSession.get("idRol") === 2 || ReactSession.get("idRol") === 3) {
                console.info('Valid Form')
                fetch(ReactSession.get("basicUri") + "herramientaparticipante/update", {
                    mode: "cors",
                    method: "PUT",
                    body: JSON.stringify({
                        id: this.state.herramientaParticipante.id,
                        observacionEntrada: this.state.Observacion,
                        updatedAt: Date.now(),
                        createdAt: this.state.herramientaParticipante.createdAt,
                        participante: this.state.participante,
                        herramienta: this.state.herramienta
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
                        console.log(this.state.herramientaParticipante);
                        console.log(this.state.herramientaParticipante.participante_cedula);
                        fetch(ReactSession.get("basicUri") + "zkt/persona/updatePrestamo/" + this.state.cedula +"/Devuelto", {
                            mode: "cors",
                            method: "POST",
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
                                this.setState({loading: false})
                                this.handleOpen('success', 'El computador fue devuelto');
                                this.setState({ CodigoDeBarras: "" });
                                this.setState({ herramienta: "" });
                                this.setState({ herramientaParticipante: "" });
                                this.setState({ Observacion: "" });
                            }).finally(()=>{
                                this.setState({loading: false})
                            })
                    }).finally(()=>{
                        this.setState({loading: false})
                    })
            } else {
                this.handleOpen('warning', 'No tiene permisos para devolver un computador')
            }
        } else {
            console.error('Invalid Form')
            this.handleOpen('error', 'Hubo un problema al devolver el computador')
        }
    };


    componentDidMount() { };

    render() {
        <Spinner open={this.state.loading} /> 
        const { errors } = this.state;
        return (
            <div className="sizer">

                <Box className="cardout">
                    <Typography variant="h4" component="h4" gutterBottom>
                        Devolver Computador
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="h5" align="center" component="h5" gutterBottom className="letras">
                                                Información del equipo
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
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Código de barras
                                                                    </Typography>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="CodigoDeBarras"
                                                                        name="CodigoDeBarras"
                                                                        value={this.state.CodigoDeBarras}
                                                                        onChange={this.handleChangeCodigoBarras}
                                                                        style={{ width: 300 }}
                                                                        noValidate
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

                                                                    <Typography variant="h5" className="letrasInt" component="h5" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Observación
                                                                    </Typography>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
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
                        <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={this.handleSubmit}>Confirmar Devolución</Button>

                    </Box>
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

export default DevolverComputadores;
