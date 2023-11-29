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
            errors: {
                CodigoDeBarras: "",
            }
        };
    }


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
        e.preventDefault();
        console.log(this.state.herramientaParticipante);
        if (validateForm(this.state.errors)) {
            console.info('Valid Form')
            fetch(ReactSession.get("basicUri") + "herramientaparticipante/update", {
                mode: "cors",
                method: "PUT",
                body: JSON.stringify({
                    id: this.state.herramientaParticipante.id,
                    observacionEntrada: this.state.Observacion,
                    updatedAt: Date.now(),
                    createdAt: this.state.herramientaParticipante.createdAt,
                    participante: {
                        id: this.state.herramientaParticipante.participante_id,
                    },
                    herramienta: {
                        id: this.state.herramientaParticipante.herrmienta_id,
                    }
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
                    console.log(this.state.herramientaParticipante);
                    console.log(this.state.herramientaParticipante.participante_cedula);
                    fetch(ReactSession.get("basicUri") + "zkt/persona/updatePrestamo/" + this.state.herramientaParticipante.participante_cedula, {
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
                        })
                });
        } else {
            console.error('Invalid Form')
        }
    };


    componentDidMount() { };

    render() {
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

                                                                    <Typography variant="h6" component="h6" spacing={2}>
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

                                                                    <Typography variant="h6" component="h6" spacing={2}>
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
            </div>
        );
    }
};

export default DevolverComputadores;
