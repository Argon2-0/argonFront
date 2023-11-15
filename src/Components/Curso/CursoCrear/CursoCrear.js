import React from 'react'
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { Box, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import './CursoCrear.css'
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import '../../../App.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';


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
            codigo: 0,
            errors: {
                nombre: "",
                codigo: ""
            }
        };
    }

    handleCheckchange = (event) => {
        if (event.target.checked) {

            this.setState({ ["form"]: "SI", ["checkVisualiza"]: true })
        }
        else {
            this.setState({ ["form"]: "NO", ["checkVisualiza"]: false })
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
            fetch(window.$basicUri + "curso/create", {
                mode: "cors",
                method: "POST",
                body: JSON.stringify({
                    nombre: this.state.nombre,
                    codigo: this.state.codigo
                }),
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': window.$token,
                    "LastTime": window.$lastTime,
                    "CurrentTime": window.$currentTime
                },
            }).then((response) => response.json())
                .then((json) => {
                    console.log(json);
                    window.$token = json[0];
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
                        Crear curso
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="h5" align="center" component="h5" gutterBottom className="letras">
                                                Información del curso
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

export default CrearCurso;
