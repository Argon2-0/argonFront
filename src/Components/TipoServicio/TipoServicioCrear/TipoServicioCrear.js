import React from 'react'
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { Box, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import './TipoServicioCrear.css'
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/base/TextareaAutosize';
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

class CrearTipoServicio extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            checkVisualiza: false,
            nombre: "",
            descripcion: "",
            disponible: "NO",
            severity: "success",
            message: "",
            open: false,
            existe: false,
            errors: {
                nombre: "",
                disponible: "",
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
    }

    validations = (name, value) => {
        console.log("validations");
        let errors = this.state.errors;
        switch (name) {
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
            if (!this.state.existe) {
                fetch(ReactSession.get("basicUri") + "tiposervicio/create", {
                    mode: "cors",
                    method: "POST",
                    body: JSON.stringify({
                        nombre: this.state.nombre,
                        descripcion: this.state.descripcion,
                        disponible: this.state.disponible,
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
                        this.handleOpen('success', 'El tipo de servicio fue creado')
                        this.setState({
                            checkVisualiza: false,
                            nombre: "",
                            descripcion: "",
                            disponible: "NO",
                            existe:false
                        });
                    })
            } else{
                fetch(ReactSession.get("basicUri") + "tiposervicio/update", {
                    mode: "cors",
                    method: "PUT",
                    body: JSON.stringify({
                        id: this.state.id,
                        nombre: this.state.nombre,
                        descripcion: this.state.descripcion,
                        disponible: this.state.disponible,
                        createdAt: this.state.createdAt,
                        updatedAt: Date.now()

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
                        this.handleOpen('success', 'El tipo de servicio fue actualizado')
                        this.setState({
                            checkVisualiza: false,
                            id:"",
                            nombre: "",
                            descripcion: "",
                            disponible: "NO",
                            existe:false
                        });
                    })
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
            id: value
        })
        fetch(
            ReactSession.get("basicUri") +
            "tiposervicio/getById/" + value,
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
                console.log(json);


                body['createdAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(body['createdAt']));
                body['updatedAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(body['updatedAt']));
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
                    nombre: body['nombre'],
                    descripcion: body['descripcion'],
                    disponible: body['disponible'],
                    createdAt: body['createdAt'],
                    updatedAt: body['updatedAt'],
                    existe: true
                }));

            }).catch(
                this.setState({ existe: false, disponible:"NO", checkVisualiza:false, nombre:"", descripcion:"" })
            )
    }

    render() {
        const { errors } = this.state;

        return (

            <div className="sizer">

                <Box className="cardout">
                    <Typography variant="h4" component="h4" gutterBottom>
                        Crear Tipo de Servicio
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
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Id
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="id"
                                                                        name="id"
                                                                        label="id"
                                                                        variant="outlined"
                                                                        value={this.state.id}
                                                                        onChange={this.existe}
                                                                        style={{ width: 300 }}
                                                                    />
                                                                </Stack>
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
                                                                <Stack direction="row" spacing={2} >
                                                                    <Typography variant="h6" component="h6" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Descripción
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextareaAutosize
                                                                        required
                                                                        id="descripcion"
                                                                        name="descripcion"
                                                                        label="descripcion"
                                                                        variant="outlined"
                                                                        value={this.state.descripcion}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    />
                                                                </Stack>
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
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.disponible.length > 0 &&
                                                                        <span className='error'>{errors.disponible}</span>}
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

export default CrearTipoServicio;
