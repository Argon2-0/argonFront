import React from 'react'
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { Box, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import './CrearEquipos.css'
import Button from '@mui/material/Button';
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

class CrearEquipos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Referencia: "",
            Descripcion: "",
            Marca: "",
            Serial: "",
            CodigoBarras: "",
            severity: "success",
            message: "",
            open: false,
            disponible: "NO",
            existe: false,
            checkVisualiza: false,
            id: "",
            errors: {
                Referencia: "",
                Descripcion: "",
                Marca: "",
                Serial: "",
                CodigoBarras: "",
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
        if (name === "CodigoBarras") {
            this.existe(event);
        }
    }

    validations = (name, value) => {
        console.log("validations");
        let errors = this.state.errors;
        switch (name) {
            case 'Referencia':
                console.log("Referencia");
                errors.Referencia =
                    value.length < 2
                        ? 'Referencia must be at least 5 characters long!'
                        : '';
                break;
            case 'Marca':
                errors.Marca =
                    value.length < 2
                        ? 'Marca must be at least 5 characters long!'
                        : '';
            case 'Serial':
                errors.Serial =
                    value.length < 2
                        ? 'Serial must be at least 5 characters long!'
                        : '';
                break;
            case 'CodigoBarras':
                errors.CodigoBarras =
                    value.length < 5
                        ? 'Codigo de barras must be at least 5 characters long!'
                        : '';
                break;

            default:
                break;
        }
        this.setState({ errors, [name]: value });

    }

    handleCheckchange = (event) => {
        if (event.target.checked) {

            this.setState({ "disponible": "SI", "checkVisualiza": true })
        }
        else {
            this.setState({ "disponible": "NO", "checkVisualiza": false })
        }
    }


    handleSubmit = (e) => {
        console.log("handlesubmit")
        const fields = ["CodigoBarras", "Descripcion", "Referencia", "Marca", "Serial"];
        e.preventDefault();
        fields.forEach(field => {
            this.validations(field, this.state[field]);
        });
        if (validateForm(this.state.errors)) {
            console.info(this.state.existe)
            if (ReactSession.get("idRol") === 1 || ReactSession.get("idRol") === 2) {
                if (!this.state.existe) {
                    fetch(ReactSession.get("basicUri") + "herramienta/create", {
                        mode: "cors",
                        method: "POST",
                        body: JSON.stringify({
                            nombre: this.state.Referencia,
                            descripcion: this.state.Descripcion,
                            marca: this.state.Marca,
                            serial: this.state.Serial,
                            codigoBarras: this.state.CodigoBarras,
                            estado: "Disponible",
                            disponible: this.state.disponible,
                            createdAt: Date.now()

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
                            this.handleOpen('success', 'El equipo fue creado')
                            this.setState({
                                Referencia: "",
                                Descripcion: "",
                                Marca: "",
                                Serial: "",
                                CodigoBarras: "",
                                existe: false,
                                checkVisualiza: false,
                                disponible: "NO",

                            })
                        })
                } else {
                    if (ReactSession.get("idRol") === 1 || ReactSession.get("idRol") === 2) {
                        fetch(ReactSession.get("basicUri") + "herramienta/update", {
                            mode: "cors",
                            method: "PUT",
                            body: JSON.stringify({
                                nombre: this.state.Referencia,
                                descripcion: this.state.Descripcion,
                                marca: this.state.Marca,
                                serial: this.state.Serial,
                                codigoBarras: this.state.CodigoBarras,
                                estado: "Disponible",
                                disponible: this.state.disponible,
                                createdAt: this.state.createdAt,
                                updatedAt: Date.now(),
                                id: this.state.id
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
                                this.handleOpen('success', 'El equipo fue actualizado')
                                this.setState({
                                    Referencia: "",
                                    Descripcion: "",
                                    Marca: "",
                                    Serial: "",
                                    id: "",
                                    CodigoBarras: "",
                                    existe: false,
                                    checkVisualiza: false,
                                    disponible: "NO",

                                })
                            })
                    } else {
                        this.handleOpen('warning', 'No tiene permisos para actualizar el equipo')
                    }
                }
            } else {
                this.handleOpen('warning', 'No tiene permisos para crear un equipo')
            }
        } else {
            console.error('Invalid Form')
            this.handleOpen('error', 'Hubo un problema en la petición')
        }
    };

    existe = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({
            codigoBarras: value
        })
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
        ).then((response) => response.json())
            .then((json) => {
                console.log(json);
                ReactSession.set("token", json[0]);
                var body = json[1];
                console.log(body)
                console.log(json);
                if (body['createdAt'] !== null) {
                    body['createdAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(body['createdAt']));
                }
                if (body['updatedAt'] !== null) {
                    body['updatedAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(body['updatedAt']));
                }

                if (body['disponible'] === "SI") {
                    this.setState({
                        checkVisualiza: true
                    })
                }
                else {
                    this.setState({
                        checkVisualiza: false
                    })
                }
                return Promise.resolve(this.setState({
                    id: body['id'],
                    CodigoBarras: body['codigoBarras'],
                    Descripcion: body['descripcion'],
                    Marca: body['marca'],
                    Serial: body['serial'],
                    Referencia: body['nombre'],
                    existe: true,
                    createdAt: body['createdAt'],
                    updatedAt: body['updatedAt'],
                    disponible: body['disponible'],
                }));

            }).catch(
                this.setState({ existe: false, disponible: "NO", checkVisualiza: false, id: "", Descripcion: "", Marca: "", Serial: "", Referencia: "" })
            )
    }


    render() {
        const { errors } = this.state;

        return (

            <div className="sizer">

                <Box className="cardout">
                    <Typography variant="h4" component="h4" gutterBottom>
                        Administrar Equipo
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
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Código de Barras
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="CodigoBarras"
                                                                        name="CodigoBarras"
                                                                        label="CodigoBarras"
                                                                        variant="outlined"
                                                                        value={this.state.CodigoBarras}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.CodigoBarras.length > 0 &&
                                                                        <span className='error'>{errors.CodigoBarras}</span>}
                                                                </Stack>

                                                            </TableCell>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h6" component="h6" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Serial
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="Serial"
                                                                        name="Serial"
                                                                        label="Serial"
                                                                        variant="outlined"
                                                                        value={this.state.Serial}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.Serial.length > 0 &&
                                                                        <span className='error'>{errors.Serial}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h6" component="h6" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Marca
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="Marca"
                                                                        name="Marca"
                                                                        label="Marca"
                                                                        variant="outlined"
                                                                        value={this.state.Marca}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.Marca.length > 0 &&
                                                                        <span className='error'>{errors.Marca}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h6" component="h6" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Referencia
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="Referencia"
                                                                        name="Referencia"
                                                                        label="Referencia"
                                                                        variant="outlined"
                                                                        value={this.state.Referencia}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.Referencia.length > 0 &&
                                                                        <span className='error'>{errors.Referencia}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h6" component="h6" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Descripción
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="Descripcion"
                                                                        name="Descripcion"
                                                                        label="Descripcion"
                                                                        variant="outlined"
                                                                        value={this.state.Descripcion}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.Descripcion.length > 0 &&
                                                                        <span className='error'>{errors.Descripcion}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <br />
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h6" component="h6" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Visualizar en el formulario
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Switch
                                                                                id="visualiza"
                                                                                name="visualiza"
                                                                                checked={this.state.checkVisualiza}
                                                                                onChange={this.handleCheckchange}
                                                                                style={{ width: 300 }}

                                                                            />
                                                                        }
                                                                        label={this.state.disponible}
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
                        <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={this.handleSubmit}>Guardar cambios</Button>

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

export default CrearEquipos;
