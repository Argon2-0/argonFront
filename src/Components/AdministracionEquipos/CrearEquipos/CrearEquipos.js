import React from 'react'
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { Box, Stack, TextField } from '@mui/material';
import './CrearEquipos.css'
import Button from '@mui/material/Button';
import '../../../App.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

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
            errors: {
                Referencia: "",
                Descripcion: "",
                Marca: "",
                Serial: "",
                CodigoBarras: "",
            }
        };
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
            case 'Referencia':
                console.log("Referencia");
                errors.Referencia =
                    value.length < 5
                        ? 'Referencia must be at least 5 characters long!'
                        : '';
                break;
            case 'Descripcion':
                errors.Descripcion =
                    value.length < 5
                        ? 'Descripcion must be at least 5 characters long!'
                        : '';
            case 'Marca':
                errors.Marca =
                    value.length < 5
                        ? 'Marca must be at least 5 characters long!'
                        : '';
            case 'Serial':
                errors.Serial =
                    value.length < 5
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

    handleSubmit = (e) => {
        console.log("handlesubmit")
        const fields = ["CodigoBarras", "Descripcion", "Referencia", "Marca", "Serial"];
        e.preventDefault();
        fields.forEach(field => {
            this.validations(field, this.state[field]);
        });
        if (validateForm(this.state.errors)) {
            console.info('Valid Form')
            fetch(window.$basicUri + "/herramienta/create", {
                mode: "cors",
                method: "POST",
                body: JSON.stringify({
                    nombre: this.state.Referencia,
                    descripcion: this.state.Descripcion,
                    marca: this.state.Marca,
                    serial: this.state.Serial,
                    codigoBarras: this.state.CodigoBarras,
                    estado: "Disponible",
                    createdAt: Date.now()

                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => response.json());
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
                        Crear equipo
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Box className="cardin">
                                            <Typography variant="h5" align="center" component="h5" gutterBottom>
                                                INFORMACIÓN DEL EQUIPO
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
                                                        </TableRow>
                                                        <TableRow>
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
                                                        </TableRow>
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
                        <Button type="submit" className="button" variant="contained" endIcon={<SendIcon />}>Guardar cambios</Button>

                    </Box>
                </Box>
            </div>
        );
    }
};

export default CrearEquipos;
