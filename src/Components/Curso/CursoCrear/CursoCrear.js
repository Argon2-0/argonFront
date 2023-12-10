import React from 'react'
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { Box, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import './CursoCrear.css'
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

class CrearCurso extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkVisualiza: false,
            nombre: "",
            codigo: "",
            severity: "success",
            message: "",
            open: false,
            disponible: "NO",
            existe: false,
            checkVisualiza: false,
            errors: {
                nombre: "",
                codigo: ""
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

    handleCheckchange = (event) => {
        if (event.target.checked) {

            this.setState({ "disponible": "SI", "checkVisualiza": true })
        }
        else {
            this.setState({ "disponible": "NO", "checkVisualiza": false })
        }
    }

    handleChange = (event) => {
        console.log(event)
        event.preventDefault();
        const { name, value } = event.target;
        this.validations(name, value);
        if (name === "codigo") {
            this.existe(event);
        }
    }

    validations = (name, value) => {
        console.log("validations");
        let errors = this.state.errors;
        switch (name) {
            case 'codigo':
                errors.codigo =
                    value.length < 4
                        ? 'codigo must be at least 4 characters long!'
                        : '';
                break;
            case 'nombre':
                errors.nombre =
                    value.length < 5
                        ? 'nombre must be at least 5 characters long!'
                        : '';
                break;
            default:
                break;
        }
        this.setState({ errors, [name]: value });

    }

    handleSubmit = (e) => {
        console.log("handlesubmit")
        const fields = ["nombre", "descripcion", "Referencia", "Marca", "Serial"];
        e.preventDefault();
        fields.forEach(field => {
            this.validations(field, this.state[field]);
        });
        if (validateForm(this.state.errors)) {
            console.info('Valid Form')
            if (ReactSession.get("idRol") === 1 || ReactSession.get("idRol") === 2 || ReactSession.get("idRol") === 3) {
                if (!this.state.existe) {
                    fetch(ReactSession.get("basicUri") + "curso/create", {
                        mode: "cors",
                        method: "POST",
                        body: JSON.stringify({
                            nombre: this.state.nombre,
                            codigo: this.state.codigo,
                            disponible: this.state.disponible
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
                            this.setState({ nombre: "" });
                            this.setState({ codigo: "" });
                            this.setState({ disponible: "NO" });
                            this.setState({ checkVisualiza: false });
                            this.setState({ existe: false });
                            this.handleOpen('success', 'El evento fue creado')
                        })
                } else {
                    fetch(ReactSession.get("basicUri") + "curso/update", {
                        mode: "cors",
                        method: "PUT",
                        body: JSON.stringify({
                            nombre: this.state.nombre,
                            codigo: this.state.codigo,
                            disponible: this.state.disponible
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
                            this.setState({ nombre: "" });
                            this.setState({ codigo: "" });
                            this.setState({ disponible: "NO" });
                            this.setState({ checkVisualiza: false });
                            this.setState({ existe: false });
                            this.handleOpen('success', 'El evento fue creado')
                        })
                }
            } else {
                this.handleOpen('warning', 'No tiene permisos para manipular el curso')
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
            codigo: value
        })
        fetch(
            ReactSession.get("basicUri") +
            "curso/getByCodigo/" + value,
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
                    codigo: body['codigo'],
                    nombre: body['nombre'],
                    disponible: body['disponible'],
                    existe: true
                }));

            }).catch(
                this.setState({ existe: false, disponible: "NO", checkVisualiza: false, nombre: "" })
            )
    }

    render() {
        const { errors } = this.state;

        return (

            <div className="sizer">

                <Box className="cardout">
                    <Typography variant="h4" component="h4" gutterBottom>
                        Crear Evento
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="h5" align="center" component="h5" gutterBottom className="letras">
                                                Información del evento
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
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Codigo
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="codigo"
                                                                        name="codigo"
                                                                        label="codigo"
                                                                        variant="outlined"
                                                                        value={this.state.codigo}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.codigo.length > 0 &&
                                                                        <span className='error'>{errors.codigo}</span>}
                                                                </Stack>
                                                                <br />

                                                            </TableCell>
                                                        </TableRow>


                                                        <TableRow>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h6" component="h6" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nombre
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="nombre"
                                                                        name="nombre"
                                                                        label="nombre"
                                                                        variant="outlined"
                                                                        value={this.state.nombre}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.nombre.length > 0 &&
                                                                        <span className='error'>{errors.nombre}</span>}
                                                                </Stack>
                                                                <br />

                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
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

export default CrearCurso;
