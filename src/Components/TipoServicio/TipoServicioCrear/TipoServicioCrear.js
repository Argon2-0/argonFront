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

const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};

class CrearTipoServicio extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkVisualiza: false,
            nombre: "",
            items: [],
            descripcion: "",
            form: "No",
            errors: {
                nombre: "",
                descripcion: "",
                form: "",
            }
        };
    }

    handleCheckchange = (event) => {
        if (event.target.checked) {

            this.setState({ "form": "SI", "checkVisualiza": true })
        }
        else {
            this.setState({ "form": "NO", "checkVisualiza": false })
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
            case 'descripcion':
                errors.descripcion =
                    value.length < 5
                        ? 'descripcion must be at least 5 characters long!'
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
            fetch(ReactSession.get("basicUri") + "tiposervicio/create", {
                mode: "cors",
                method: "POST",
                body: JSON.stringify({
                    nombre: this.state.nombre,
                    descripcion: this.state.descripcion,
                    form: this.state.form,
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
                })
        } else {
            console.error('Invalid Form')
        }
    };



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
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.descripcion.length > 0 &&
                                                                        <span className='error'>{errors.descripcion}</span>}
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
                                                                        label={this.state.form}
                                                                    />

                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.form.length > 0 &&
                                                                        <span className='error'>{errors.form}</span>}
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
            </div>
        );
    }
};

export default CrearTipoServicio;
