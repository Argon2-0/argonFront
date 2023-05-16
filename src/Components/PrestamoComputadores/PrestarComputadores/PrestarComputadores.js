import { Box, FormControlLabel, TextField, Typography } from "@mui/material";
import React from "react";
import SendIcon from '@mui/icons-material/Send';
import './PrestarComputadores.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { TipoServicio } from "../../../Data/TipoServico";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import Switch from '@mui/material/Switch';
import { Participante } from "../../../Data/Participante";
import { Herramienta } from "../../../Data/Herramienta";



const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};

class PrestarComputadores extends React.Component {
    constructor(props) {
        console.log(dayjs(new Date()));
        super(props);
        this.state = {
            participante: "",
            tipoDocumento: "",
            cedula: "",
            nombres: "",
            apellidos: "",
            celular: "",
            CodigoDeBarras: "",
            herramienta: "",
            Observacion: "",
            errors: {
                tipoDocumento: "",
                cedula: "",
                nombres: "",
                apellidos: "",
                fechaNacimiento: "",
                celular: "",
                tiposervicio: "",
                tratDatos: "",
                CodigoDeBarras: "",
                Observacion: "",
            }
        };
    }

    handleDatechange = (event, date) => {
        this.setState({ ["fechaNacimiento"]: date })
    }
    handleCheckchange = (event) => {
        if (event.target.checked) {

            this.setState({ ["tratDatos"]: "SI", ["checkTratDatos"]: true })
        }
        else {
            this.setState({ ["tratDatos"]: "NO", ["checkTratDatos"]: false })
        }
    }
    handleChange = (event) => {
        console.log(event)
        event.preventDefault();
        const { name, value } = event.target;
        this.validations(name, value);
    }

    handleChangeDocument = (event) => {
        let errors = this.state.errors;

        console.log("event")
        event.preventDefault();
        const { name, value } = event.target;
        this.validations(name, value);
        if (validateForm(this.state.errors)) {
            let participante = "";
            fetch(
                window.$basicUri +
                "participante/getByCedula/" + value,
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
                    console.log(json);

                    if (json['fechaNacimiento'] != null) {
                        json['fechaNacimiento'] = (json['fechaNacimiento'])[2] + "/" + (json['fechaNacimiento'])[1] + "/" + (json['fechaNacimiento'])[0];
                    }
                    json['createdAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(json['createdAt']));
                    json['updatedAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(json['updatedAt']));

                    participante = new Participante(
                        json['id'],
                        json['tipoDocumento'],
                        json['cedula'],
                        json['nombres'],
                        json['apellidos'],
                        json['fechaNacimiento'],
                        json['celular'],
                        json['sexo'],
                        json['email'],
                        json['curso'],
                        json['tratDatos'],
                        json['estado'],
                        json['createdAt'],
                        json['updatedAt'],
                        json['tiposervicio']
                    );
                    this.setState({ ["participante"]: participante });
                    this.setState({ ["tipoDocumento"]: json['tipoDocumento'] });
                    this.setState({ ["nombres"]: json['nombres'] });
                    this.setState({ ["apellidos"]: json['apellidos'] });
                    this.setState({ ["celular"]: json['celular'] });

                }).then().catch((reason) => {
                    console.log(reason);
                    errors.cedula = 'El documento no existe';
                    this.setState({ ["participante"]: '' });
                    this.setState({ ["tipoDocumento"]:''});
                    this.setState({ ["nombres"]: ''});
                    this.setState({ ["apellidos"]: ''});
                    this.setState({ ["celular"]: ''});


                }).then(() => {
                    console.log(errors);
                    this.setState({ errors });
                });
        }
    }

    handleChangeCodigoBarras = (event) => {
        let errors = this.state.errors;
        const { name, value } = event.target;
        console.log("event")
        event.preventDefault();

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
                        "herramientaparticipante/getByHerramientaIdAndEstado/" + herramienta.id +"/Préstado",
                        {
                            mode: "cors",
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    ).then((response) => response.json())
                    .then((json) => {
                        console.log(json);
                        errors.CodigoDeBarras = 'El equipo se encuentra préstado';
                        this.validations(name, value);
                        this.setState({ errors });
                    }).catch((reason) => {
                        console.log(reason);
                        errors.CodigoDeBarras = '';
                    }).then(() => {
                        console.log(errors);
                        this.validations(name, value);
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
        switch (name) {
            case 'tipoDocumento':
                errors.tipoDocumento =
                    value === ""
                        ? 'Should select a document type!'
                        : '';
                break;
            case 'cedula':
                errors.cedula =
                    value.length < 5
                        ? 'Id must be at least 5 characters long!'
                        : '';
            case 'nombres':
                errors.nombres =
                    value.length < 2
                        ? 'Nombres must be at least 2 characters long!'
                        : '';
            case 'apellidos':
                errors.apellidos =
                    value.length < 2
                        ? 'Id must be at least 2 characters long!'
                        : '';
                break;
            case 'fechaNacimiento':
                errors.fechaNacimiento =
                    value === ""
                        ? 'Should select a birth date!'
                        : '';
                break;
            case 'tiposervicio':
                errors.tiposervicio =
                    value === ""
                        ? 'Tipo servicio select a document type!'
                        : '';
                break;
            default:
                break;
        }
        this.setState({ errors, [name]: value });

    }

    handleSubmit = (e) => {
        const fields = ["tipoDocumento", "cedula", "nombres", "apellidos", "fechaNacimiento", "celular", "tiposervicio", "tratDatos"];
        e.preventDefault();
        fields.forEach(field => {
            this.validations(field, this.state[field]);
        });
        if (validateForm(this.state.errors)) {
            console.info('Valid Form')
            fetch(window.$basicUri + "/herramientaparticipante/create", {
                mode: "cors",
                method: "POST",
                body: JSON.stringify({
                    participante: this.state.participante ,
                    herramienta: this.state.herramienta,
                    observacion: this.state.Observacion,
                    estado: 'Préstado',
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


    componentDidMount() {
        fetch(
            window.$basicUri +
            "tiposervicio/getAll",
            {
                mode: "cors",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((response) => response.json())
            .then((json) => {
                let tiposServiciosJson = [];
                for (let pos = 0; pos < json.length; pos++) {
                    json[pos]['createdAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(json[pos]['createdAt']));
                    json[pos]['updatedAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(json[pos]['updatedAt']));
                    tiposServiciosJson.push(new TipoServicio(
                        json[pos]['id'],
                        json[pos]['nombre'],
                        json[pos]['descripcion'],
                        json[pos]['createdAt'],
                        json[pos]['updatedAt'],
                        json[pos]['form']));
                }
                this.setState({ ["tiposservicios"]: tiposServiciosJson });
            })
    };
    render() {
        const { errors } = this.state;
        return (
            <div className="RegisterComponent">

                <Box className="card">
                    <Typography variant="h4" component="h4" gutterBottom>
                        Prestar computador
                    </Typography>
                    <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }} className="card">
                        <Typography variant="h5" component="h5" gutterBottom>
                            INFORMACION DEL SOLICITANTE
                        </Typography>

                        <Stack direction="row" spacing={2} >

                            <Typography variant="h6" component="h6" spacing={2}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tipo de documento
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={8} >
                            <br />
                            <Select
                                required
                                id="TipoDeDocumento"
                                name="tipoDocumento"
                                value={this.state.tipoDocumento}
                                onChange={this.handleChange}
                                style={{ width: 300 }}
                                disabled
                                variant="filled"
                            >
                                <MenuItem key="1" value="Cédula de ciudadania" width="300">Cédula de ciudadania</MenuItem>
                                <MenuItem key="2" value="Cédula de extranjeria" width="300">Cédula de extranjeria</MenuItem>
                                <MenuItem key="3" value="Registro único tributario" width="300">Registro único tributario</MenuItem>
                                <MenuItem key="4" value="Registro civil" width="300">Registro civil</MenuItem>
                                <MenuItem key="5" value="Numero identificación tributaria" width="300">Numero identificación tributaria</MenuItem>
                                <MenuItem key="6" value="Pasaporte" width="300">Pasaporte</MenuItem>
                                <MenuItem key="7" value="Tarjeta de identidad" width="300">Tarjeta de identidad</MenuItem>
                                <MenuItem key="8" value="Permiso especial de permanencia" width="300">Permiso especial de permanencia</MenuItem>
                                <MenuItem key="9" value="NIT" width="300">NIT</MenuItem>
                                <MenuItem key="10" value="Desconocido" width="300">Desconocido</MenuItem>
                            </Select>

                        </Stack>
                        <Stack direction="row" spacing={8} >
                            <br />
                            {errors.tipoDocumento.length > 0 &&
                                <span className='error'>{errors.tipoDocumento}</span>}
                        </Stack>
                        <br />
                        <Stack direction="row" spacing={2} >

                            <Typography variant="h6" component="h6" spacing={2}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Numero de documento
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={8} >
                            <br />
                            <TextField
                                required
                                id="Cedula"
                                name="cedula"
                                value={this.state.cedula}
                                onChange={this.handleChangeDocument}
                                style={{ width: 300 }}
                                noValidate
                            />
                        </Stack>
                        <Stack direction="row" spacing={8} >
                            <br />
                            {errors.cedula.length > 0 &&
                                <span className='error'>{errors.cedula}</span>}
                        </Stack>
                        <br />
                        <Stack direction="row" spacing={2} >

                            <Typography variant="h6" component="h6" spacing={2}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nombres
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={8} >
                            <br />
                            <TextField
                                required
                                id="Nombres"
                                name="nombres"
                                value={this.state.nombres}
                                onChange={this.handleChange}
                                style={{ width: 300 }}
                                noValidate
                                disabled
                                variant="filled"
                            />
                        </Stack>
                        <Stack direction="row" spacing={8} >
                            <br />
                            {errors.nombres.length > 0 &&
                                <span className='error'>{errors.nombres}</span>}
                        </Stack>
                        <br />
                        <Stack direction="row" spacing={2} >

                            <Typography variant="h6" component="h6" spacing={2}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Apellidos
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={8} >
                            <br />
                            <TextField
                                required
                                id="Apellidos"
                                name="apellidos"
                                value={this.state.apellidos}
                                onChange={this.handleChange}
                                style={{ width: 300 }}
                                noValidate
                                disabled
                                variant="filled"
                            />
                        </Stack>
                        <Stack direction="row" spacing={8} >
                            <br />
                            {errors.apellidos.length > 0 &&
                                <span className='error'>{errors.apellidos}</span>}
                        </Stack>
                        <br />
                        <Stack direction="row" spacing={2} >

                            <Typography variant="h6" component="h6" spacing={2}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Celular
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={8} >
                            <br />
                            <TextField
                                required
                                id="Celular"
                                name="celular"
                                value={this.state.celular}
                                onChange={this.handleChange}
                                style={{ width: 300 }}
                                disabled
                                variant="filled"
                            />

                        </Stack>
                        <Stack direction="row" spacing={8} >
                            <br />
                            {errors.celular.length > 0 &&
                                <span className='error'>{errors.celular}</span>}
                        </Stack>
                        <br />
                        <br />
                        <Box textAlign='center'>
                            <Button type="submit" className="button" variant="contained" endIcon={<SendIcon />}>Crear visitante</Button>

                        </Box>
                    </Box>
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

export default PrestarComputadores;
