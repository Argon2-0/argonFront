import React from 'react'
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { Box, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import './TipoServicioCrear.css'
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/base/TextareaAutosize';

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
            descripcion: "",
            form: "No",
            errors: {
                nombre: "",
                descripcion: "",
                form: "",
            }
        };
    }

    handleCheckchange = (event) =>{
        if(event.target.checked){
            
            this.setState({["form"]:"SI", ["checkVisualiza"]: true})
        }
        else{
            this.setState({["form"]:"NO", ["checkVisualiza"]: false})
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
            fetch(window.$basicUri + "/tiposervicio/create", {
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
                },
            }).then((response) => response.json());
        } else {
            console.error('Invalid Form')
        }
    };

    render() {
        const {errors} = this.state;

        return (

            <div className="RegisterComponent">

                <Box className="card">
                    <Typography variant="h4" component="h4" gutterBottom>
                        Crear equipo
                    </Typography>
                    <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }} className="card">

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
                        <br />
                        <br />
                        <Box textAlign='center'>
                            <Button type="submit" className="button" variant="contained" endIcon={<SendIcon />}>Guardar cambios</Button>

                        </Box>
                    </Box>
                </Box>
            </div>
        );
    }
};

export default CrearTipoServicio;
