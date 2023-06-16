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
            tratDatos: "NO",
            errors: {
                tipoDocumento: "",
                cedula: "",
                nombres: "",
                apellidos: "",
                fechaNacimiento: "",
                celular: "",
                tiposervicio: "",
                tratDatos: "",
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
            fetch(window.$basicUri + "/participante/create", {
                mode: "cors",
                method: "POST",
                body: JSON.stringify({
                    tipoDocumento: this.state.tipoDocumento,
                    cedula: this.state.cedula,
                    nombres: this.state.nombres,
                    apellidos: this.state.apellidos,
                    fechaNacimiento: new Date(this.state.fechaNacimiento.toISOString()).getTime(),
                    tratDatos: this.state.tratDatos,
                    tiposervicio: {
                        id: this.state.tiposervicio,
                    },
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
                                                {(this.state.validado === false)
                                                    ? (<>
                                                        <Table>

                                                            <TableBody>
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
                                                                                onChange={this.handleChange}
                                                                                style={{ width: 300 }}
                                                                                noValidate
                                                                            />
                                                                        </Stack>
                                                                        <Stack direction="row" spacing={8} >
                                                                            <br />
                                                                            {errors.cedula.length > 0 &&
                                                                                <span className='error'>{errors.cedula}</span>}
                                                                        </Stack>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                        <Box textAlign='center'>
                                                            <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={this.handleValidado}>Crear visitante</Button>

                                                        </Box>
                                                    </>) : ""}
                                                {(this.state.validado === true) ? (<>
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
                                                                            onChange={this.handleChange}
                                                                            style={{ width: 300 }}
                                                                            noValidate
                                                                        />
                                                                    </Stack>
                                                                    <Stack direction="row" spacing={8} >
                                                                        <br />
                                                                        {errors.cedula.length > 0 &&
                                                                            <span className='error'>{errors.cedula}</span>}
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
                                                                                this.state.tiposservicios?.map((element, index) => {
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
                                                        </TableBody>
                                                    </Table></>) : ""}
                                            </TableContainer>

                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box textAlign='center'>
                        <Button type="submit" className="button" variant="contained" endIcon={<SendIcon />}>Crear visitante</Button>

                    </Box>
                </Box>
            </div >
        );
    }
};

export default AutoCrearVisitante;
