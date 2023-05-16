import React from 'react'
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { Box, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import './DevolverComputadores.css'
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { Herramienta } from '../../../Data/Herramienta';
import { HerramientaParticipante } from '../../../Data/HerramientaParticipante';

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
                Observacion: "",
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
        let errors = this.state.errors;
        const { name, value } = event.target;
        console.log("event")
        event.preventDefault();
        var herramientaParticipante ;
        let herramienta = "";
        fetch(
            window.$basicUri +
            "herramienta/getByCodigoBarras/" + value,
            {
                mode: "cors",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                json['createdAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(json['createdAt']));
                json['updatedAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(json['updatedAt']));

                herramienta = new Herramienta(
                    json['id'],
                    json['nombre'],
                    json['descripcion'],
                    json['marca'],
                    json['serial'],
                    json['codigoBarras'],
                    json['estado'],
                    json['createdAt'],
                    json['updatedAt'],
                    json['participante'],
                );
            }).then(() => {
                errors.CodigoDeBarras = '';
                this.validations(name, value);
                this.setState({ errors, ['herramienta']: herramienta });
                fetch(
                    window.$basicUri +
                    "herramientaparticipante/getByHerramientaIdAndEstado/" + herramienta.id + "/Préstado",
                    {
                        mode: "cors",
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ).then((response) => response.json())
                    .then((json) => {
                        herramientaParticipante = new HerramientaParticipante(
                            json['id'],
                            json['observacion'],
                            json['estado'],
                            json['totHoras'],
                            json['createdAt'],
                            json['updatedAt'],
                            json['participante'],
                            json['herramienta'],
                        );
                        console.log(json);
                        errors.CodigoDeBarras = '';
                        
                    }).then(()=>{
                        this.setState({ errors , ["herramientaParticipante"]: herramientaParticipante});
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
            fetch(window.$basicUri + "herramientaparticipante/update", {
                mode: "cors",
                method: "PUT",
                body: JSON.stringify({
                    id: this.state.herramientaParticipante.id,
                    observacion: this.state.Observacion,
                    updatedAt: Date.now(),
                    createdAt: this.state.herramientaParticipante.createdAt,
                    participante:{
                        id: this.state.herramientaParticipante.participante_id,
                    },
                    herramienta:{
                        id: this.state.herramientaParticipante.herrmienta_id,
                    }
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => response.json());
        } else {
            console.error('Invalid Form')
        }
    };


    componentDidMount() { };

    render() {
        const { errors } = this.state;
        return (
            <div className="RegisterComponent">

                <Box className="card">
                    <Typography variant="h4" component="h4" gutterBottom>
                        Devolver computador
                    </Typography>
                    <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }} className="card">
                        <Typography variant="h5" component="h5" gutterBottom>
                            INFORMACION DEL EQUIPO
                        </Typography>

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
                                noValidate
                            />

                        </Stack>
                        <Stack direction="row" spacing={8} >
                            <br />
                            {errors.CodigoDeBarras.length > 0 &&
                                <span className='error'>{errors.CodigoDeBarras}</span>}
                        </Stack>
                        <br />
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
                        <Stack direction="row" spacing={8} >
                            <br />
                            {errors.Observacion.length > 0 &&
                                <span className='error'>{errors.Observacion}</span>}
                        </Stack>
                        <br />
                        <br />
                        <Box textAlign='center'>
                            <Button type="submit" className="button" variant="contained" endIcon={<SendIcon />}>Crear visitante</Button>

                        </Box>
                    </Box>

                </Box>
            </div>
        );
    }
};

export default DevolverComputadores;
