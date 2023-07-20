import { Box, FormControlLabel, TextField, Typography } from "@mui/material";
import React from "react";
import SendIcon from '@mui/icons-material/Send';
import './AutoCrearVisitante.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { TipoServicio } from "../../../Data/TipoServico";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import Switch from '@mui/material/Switch';
import '../../../App.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Participante } from "../../../Data/Participante";

const validPhoneRegex = RegExp(
    /((300|301|302|303|304|305|310|311|312|313|314|315|316|317|318|319|320|321|322|323|350|351)+([0-9]{7}))\b/i
);
const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};

class AutoCrearVisitante extends React.Component {
    constructor(props) {
        console.log(dayjs(new Date()));
        super(props);
        this.state = {
            validado: false,
            checkTratDatos: false,
            tiposservicios: [""],
            tipoDocumento: "",
            cedula: "",
            nombres: "",
            apellidos: "",
            fechaNacimiento: dayjs(new Date()),
            celular: "",
            tiposervicio: "",
            sexo: "",
            tratDatos: "NO",
            sexoZK: "",
            tipoDocumentoZK: "",
            errors: {
                tipoDocumento: "",
                cedula: "",
                nombres: "",
                apellidos: "",
                fechaNacimiento: "",
                celular: "",
                tiposervicio: "",
                tratDatos: "",
                sexo: "",
                sexoZK: "",
                tipoDocumentoZK: "",
            }
        };
    }

    handleDatechange = (event) => {
        this.setState({ ["fechaNacimiento"]: event.$d })
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
        console.log(value);
        this.validations(name, value);
    }
    handleValidado = (event) => {
        console.log("ssaass")
        this.setState({ ["validado"]: true })
    }
    handleChangeDocument = (event) => {


        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;
        this.validations(name, value).then(() => {
            console.log(this.state.tipoDocumento);
            console.log(this.state.cedula);
            if (validateForm(this.state.errors)) {
                console.log(this.state.tipoDocumento);
                console.log(this.state.cedula);
            }
            if (validateForm(this.state.errors) && this.state.tipoDocumento !== "" && this.state.cedula !== "") {
                let participante = "";

                fetch(
                    window.$basicUri +
                    "participante/getByTipoDocumentoAndCedula/" + this.state.tipoDocumento + "/" + this.state.cedula,
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
                        this.setState({ ["nombres"]: json['nombres'] });
                        this.setState({ ["apellidos"]: json['apellidos'] });
                        this.setState({ ["celular"]: json['celular'] });
                        this.setState({ ["sexo"]: json['sexo'] });
                        this.setState({ ["tratDatos"]: json['tratDatos'] });
                        this.setState({ ["tiposervicio"]: json['tiposervicio']['id'] });
                        if (json['tratDatos'] === "SI") {
                            this.setState({ ["checkTratDatos"]: true });
                        }
                        else {
                            this.setState({ ["checkTratDatos"]: false });
                        }

                    }).then().catch((reason) => {
                        console.log(reason);
                        this.setState({ ["participante"]: '' });
                        this.setState({ ["nombres"]: '' });
                        this.setState({ ["apellidos"]: '' });
                        this.setState({ ["celular"]: '' });
                        this.setState({ ["sexo"]: '' });
                        this.setState({ ["tratDatos"]: '' });
                        this.setState({ ["tiposervicio"]: '' });

                    }).then(() => {
                        console.log(errors);
                        this.setState({ errors });
                    });
            }
        });


    }

    setClickOnDocumento = (e) => {
        console.log("documento")
        this.setState({ ['actual']: "documento" });
    }

    validations = (name, value) => {
        let errors = this.state.errors;
        switch (name) {
            case 'tipoDocumento': {
                console.log(value)
                switch (value) {
                    case 'C.C':
                        this.setState({ ["tipoDocumentoZK"]: 2000 });
                        break;
                    case 'C.E':
                        this.setState({ ["tipoDocumentoZK"]: 2002 });
                        break;
                    case 'Registro único tributario':
                        this.setState({ ["tipoDocumentoZK"]: 8 });
                        break;
                    case 'Registro civil':
                        this.setState({ ["tipoDocumentoZK"]: 8 });
                        break;
                    case 'Numero identificación tributaria':
                        this.setState({ ["tipoDocumentoZK"]: 8 });
                        break;
                    case 'Pasaporte':
                        this.setState({ ["tipoDocumentoZK"]: 3 });
                        break;
                    case 'T.I':
                        this.setState({ ["tipoDocumentoZK"]: 2001 });
                        break;
                    case 'Permiso de permanencia':
                        this.setState({ ["tipoDocumentoZK"]: 2004 });
                        break;
                    case 'NIT':
                        this.setState({ ["tipoDocumentoZK"]: 8 });
                        break;
                    case 'Desconocido':
                        this.setState({ ["tipoDocumentoZK"]: 8 });
                        break;
                    default:
                        break;

                };
                errors.tipoDocumento =
                    value === ""
                        ? 'Should select a document type!'
                        : ''
                break;
            }
            case 'cedula':
                errors.cedula =
                    value.length < 5
                        ? 'Id must be at least 5 characters long!'
                        : '';
                break;
            case 'nombres':
                errors.nombres =
                    value.length < 2
                        ? 'Nombres must be at least 2 characters long!'
                        : '';
                break;
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
            case 'celular':
                errors.celular =
                    validPhoneRegex.test(value)
                        ? ''
                        : 'Numero de celular no valido';
                break;
            case 'tiposervicio':
                errors.tiposervicio =
                    value === ""
                        ? 'Tipo servicio select a document type!'
                        : '';
                break;
            case 'sexo':
                errors.tipoDocumento =
                    value === ""
                        ? 'Should select a sex!'
                        : ''
                break;

            default:
                break;
        }
        return Promise.resolve(this.setState({ errors, [name]: value }));

    }

    handleSubmit = () => {
        console.log("handleAuto")
        const fields = ["tipoDocumento", "cedula", "nombres", "apellidos", "fechaNacimiento", "celular", "tiposervicio", "tratDatos", "sexo"];
        fields.forEach(field => {
            this.validations(field, this.state[field]);
        });
        if (validateForm(this.state.errors)) {
            console.info('Valid Form')
            fetch(window.$basicUri + "participante/create", {
                mode: "cors",
                method: "POST",
                body: JSON.stringify({
                    tipoDocumento: this.state.tipoDocumento,
                    cedula: this.state.cedula,
                    nombres: this.state.nombres,
                    apellidos: this.state.apellidos,
                    fechaNacimiento: new Date(this.state.fechaNacimiento.toISOString()).getTime(),
                    tratDatos: this.state.tratDatos,
                    celular: this.state.celular,
                    tiposervicio: {
                        id: this.state.tiposervicio,
                    },
                    createdAt: Date.now(),
                    sexo: this.state.sexo

                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(() => {
                fetch(window.$basicUri + "zkt/persona/create", {
                    mode: "cors",
                    method: "POST",
                    body: JSON.stringify({
                        birthday: this.state.fechaNacimiento.toISOString().toString().split("T")[0],
                        carPlate: this.state.cedula,
                        cardNo: this.state.cedula,
                        certNumber: this.state.cedula,
                        certType: this.state.tipoDocumentoZK,
                        gender: this.state.sexo,
                        lastName: this.state.apellidos,
                        mobilePhone: this.state.celular,
                        name: this.state.nombres,
                        pin: this.state.cedula,


                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            });
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
            <div className="sizer">

                <Box className="cardout">
                    <Typography variant="h4" component="h4" gutterBottom>
                        Crear visitante
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Box className="cardin">
                                            <Typography variant="h5" align="center" component="h5" gutterBottom>
                                                INFORMACION DEL VISITANTE
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
                                                                    >
                                                                        <MenuItem key="C.C" value="C.C" width="300">Cédula de ciudadania</MenuItem>
                                                                        <MenuItem key="C.E" value="C.E" width="300">Cédula de extranjeria</MenuItem>
                                                                        <MenuItem key="Registro único tributario" value="Registro único tributario" width="300">Registro único tributario</MenuItem>
                                                                        <MenuItem key="Registro civil" value="Registro civil" width="300">Registro civil</MenuItem>
                                                                        <MenuItem key="Numero identificación tributaria" value="Numero identificación tributaria" width="300">Numero identificación tributaria</MenuItem>
                                                                        <MenuItem key="Pasaporte" value="Pasaporte" width="300">Pasaporte</MenuItem>
                                                                        <MenuItem key="T.I" value="T.I" width="300">Tarjeta de identidad</MenuItem>
                                                                        <MenuItem key="Permiso de permanencia" value="Permiso de permanencia" width="300">Permiso especial de permanencia</MenuItem>
                                                                        <MenuItem key="NIT" value="NIT" width="300">NIT</MenuItem>
                                                                        <MenuItem key="Desconocido" value="Desconocido" width="300">Desconocido</MenuItem>
                                                                    </Select>

                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.tipoDocumento.length > 0 &&
                                                                        <span className='error'>{errors.tipoDocumento}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>


                                                        <TableRow>
                                                            <TableCell>
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
                                                                        onClick={this.setClickOnDocumento}
                                                                    />
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.cedula.length > 0 &&
                                                                        <span className='error'>{errors.cedula}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                        {(this.state.validado === false) ? (<>
                                                            <Box textAlign='center'>
                                                                <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={this.handleValidado}>Crear visitante</Button>

                                                            </Box>
                                                        </>) : ""}
                                                        {(this.state.validado === true) ? (<>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Stack direction="row" spacing={2} >
                                                                        <Typography variant="h6" component="h6" spacing={2}>
                                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sexo
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Stack direction="row" spacing={8} >
                                                                        <br />
                                                                        <Select
                                                                            required
                                                                            id="Sexo"
                                                                            name="sexo"
                                                                            value={this.state.sexo}
                                                                            onChange={this.handleChange}
                                                                            style={{ width: 300 }}
                                                                        >
                                                                            <MenuItem key="F" value="F" width="300">Femenino</MenuItem>
                                                                            <MenuItem key="M" value="M" width="300">Masculino</MenuItem>
                                                                        </Select>

                                                                    </Stack>
                                                                    <Stack direction="row" spacing={8} >
                                                                        <br />
                                                                        {errors.tipoDocumento.length > 0 &&
                                                                            <span className='error'>{errors.sexo}</span>}
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
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
                                                                        />
                                                                    </Stack>
                                                                    <Stack direction="row" spacing={8} >
                                                                        <br />
                                                                        {errors.nombres.length > 0 &&
                                                                            <span className='error'>{errors.nombres}</span>}
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
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
                                                                        />
                                                                    </Stack>
                                                                    <Stack direction="row" spacing={8} >
                                                                        <br />
                                                                        {errors.apellidos.length > 0 &&
                                                                            <span className='error'>{errors.apellidos}</span>}
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Stack direction="row" spacing={2} >

                                                                        <Typography variant="h6" component="h6" spacing={2}>
                                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fecha de nacimiento
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Stack direction="row" spacing={8} >
                                                                        <br />
                                                                        <DatePicker
                                                                            required
                                                                            autoOk={true}
                                                                            id="FechaDeNacimiento"
                                                                            name="fechaNacimiento"
                                                                            value={this.state.fechaNacimiento}
                                                                            onChange={this.handleDatechange}
                                                                            style={{ width: 300 }}
                                                                            noValidate
                                                                        />
                                                                    </Stack>
                                                                    <Stack direction="row" spacing={8} >
                                                                        <br />
                                                                        {errors.fechaNacimiento.length > 0 &&
                                                                            <span className='error'>{errors.fechaNacimiento}</span>}
                                                                    </Stack>

                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
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
                                                                        />

                                                                    </Stack>
                                                                    <Stack direction="row" spacing={8} >
                                                                        <br />
                                                                        {errors.celular.length > 0 &&
                                                                            <span className='error'>{errors.celular}</span>}
                                                                    </Stack>

                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Stack direction="row" spacing={2} >

                                                                        <Typography variant="h6" component="h6" spacing={2}>
                                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tipo de servicio
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Stack direction="row" spacing={8} >
                                                                        <br />
                                                                        <Select
                                                                            required
                                                                            id="TipoDeServicio"
                                                                            name="tiposervicio"
                                                                            value={this.state.tiposervicio}
                                                                            onChange={this.handleChange}
                                                                            style={{ width: 300 }}
                                                                        >
                                                                            if(this.state.tiposservicios !== [""]){
                                                                                this.state.tiposservicios?.map((element, index = element?.id) => {
                                                                                    return (
                                                                                        <MenuItem key={index} value={element?.id} width="300">{element?.nombre}</MenuItem>

                                                                                    );
                                                                                })}
                                                                        </Select>

                                                                    </Stack>
                                                                    <Stack direction="row" spacing={8} >
                                                                        <br />
                                                                        {errors.tiposervicio.length > 0 &&
                                                                            <span className='error'>{errors.tiposervicio}</span>}
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Stack direction="row" spacing={2} >

                                                                        <Typography variant="h6" component="h6" spacing={2}>
                                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Autoriza tratamiento de datos
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Stack direction="row" spacing={8} >
                                                                        <br />
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Switch
                                                                                    id="TratamientoDeDatos"
                                                                                    name="tratDatos"
                                                                                    checked={this.state.checkTratDatos}
                                                                                    onChange={this.handleCheckchange}
                                                                                    style={{ width: 300 }}

                                                                                />
                                                                            }
                                                                            label={this.state.tratDatos}
                                                                        />

                                                                    </Stack>
                                                                    <Stack direction="row" spacing={8} >
                                                                        <br />
                                                                        {errors.tratDatos.length > 0 &&
                                                                            <span className='error'>{errors.tratDatos}</span>}
                                                                    </Stack>
                                                                    <br />

                                                                </TableCell>
                                                            </TableRow>
                                                        </>) : ""}
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
                        <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={this.handleSubmit}>Crear visitante</Button>

                    </Box>
                </Box>
            </div >
        );
    }
};

export default AutoCrearVisitante;
