import React from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import '../../App.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, FormControl, OutlinedInput, InputLabel } from '@mui/material';
import { ReactSession } from 'react-client-session';
import Protege from '../../Auth/Protege';
const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};
class Perfil extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            correo: "",
            name: "",
            password: "",
            newpassword: "",
            confirmpassword: "",
            severity: "success",
            message: "",
            id: "",
            open: false,
            errors: {
                correo: "",
                password: "",
                newpassword: "",
                confirmpassword: ""
            }
        };
    }

    handleEmail = (e) => {
        const { value } = e.target;
        let errors = this.state.errors;
        fetch(
            ReactSession.get("basicUri") +
            "userInfo/getByEmail",
            {
                mode: "cors",
                method: "POST",
                body: JSON.stringify({
                    email: value,
                }),
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': ReactSession.get("token"),
                    "LastTime": ReactSession.get("lastTime"),
                    "CurrentTime": ReactSession.get("currentTime"),
                        "id": ReactSession.get("idRol")
                },
            }
        )
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                ReactSession.set("token", json[0]);
                var body = json[1];
                console.log(body)
                this.setState({ name: body["name"] })
                this.setState({ id: body["id"] })


            }).then(() => {
                errors.correo = ""
            }).catch(
                this.setState({ name: "" }),
                errors.correo = "Correo no existe"

            )
        this.setState({ errors, correo: value })
    }

    handleChange = (event) => {
        console.log(event)
        event.preventDefault();
        const { name, value } = event.target;
        console.log(value)
        console.log(name)

        if (name === "correo" && ReactSession.get("idRol")===1) {
            console.log("correo")
            this.handleEmail(event)
        } else if (name === "password") {
            this.validaContraseña(event)
        } else {
            this.validations(name, value);
        }
    }

    validaContraseña = (e) => {
        const { value } = e.target;
        let errors = this.state.errors;
        Protege(value).then(response => {
            fetch(ReactSession.get("basicUri") + "userLogin/Login", {
                mode: "cors",
                method: "POST",
                body: JSON.stringify({
                    email: this.state.correo,
                    password: response.toString()
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => (response.json())
                ).then((body) => {
                    errors.password = ""
                    if (value === this.state.newpassword) {
                        errors.newpassword = 'La contraseña debe ser diferente a la actual'
                    } else {
                        errors.newpassword = ""
                    }
                }).catch(
                    console.log("hhhggg"),
                    errors.password = "La contraseña no coincide",
                    this.setState({ errors, password: value })
                ).then(() => {
                    this.setState({ errors, password: value })
                })

        })
    }

    validations = (name, value) => {
        console.log("validations");
        let errors = this.state.errors;
        console.log(value)
        switch (name) {
            case 'newpassword':
                errors.newpassword =
                    value === this.state.password
                        ? 'La contraseña debe ser diferente a la actual'
                        : '';
                errors.confirmpassword =
                    value !== this.state.confirmpassword && this.state.confirmpassword !== ""
                        ? 'Las contraseñas no coinciden'
                        : '';
                break;
            case 'confirmpassword':
                errors.confirmpassword =
                    value !== this.state.newpassword
                        ? 'Las contraseñas no coinciden'
                        : '';
                break;
            default:
                break;
        }
        this.setState({ errors, [name]: value });

    }

    componentDidMount() {
        this.setState({correo: ReactSession.get("email"), name: ReactSession.get("name"), id: ReactSession.get("id")})
        
    };

    handleSubmit = (e) => {
        if (validateForm(this.state.errors)) {
            Protege(this.state.newpassword).then(response => {
                console.log(response)
                console.log(this.state.newpassword)
                fetch(ReactSession.get("basicUri") + "user/update", {
                    mode: "cors",
                    method: "PUT",
                    body: JSON.stringify({
                        id: this.state.id,
                        email: this.state.email,
                        password: response.toString(),
                        updatedAt: Date.now()

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
                        this.setState({ name: "" });
                        this.setState({ correo: "" });
                        this.setState({ password: "" });
                        this.setState({ newpassword: "" });
                        this.setState({ confirmPassword: "" });
                        //this.handleOpen('success', 'El usuario fue actualizado')
                    })
            })
        } else {
            console.error('Invalid Form')
            //this.handleOpen('error', 'Hubo un problema al crear el usuario')
        }
    }
    render() {
        const { errors } = this.state;
        return (
            <div className="RegisterComponent" >

                <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }} className="cardout">

                    <Typography variant="h4" align="Left" component="h4" gutterBottom className="letras">
                        Editar perfil
                    </Typography>

                    <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }} className="cardin">
                        <TableContainer >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="h5" align="Left" component="h5" gutterBottom>
                                                Información del usuario
                                            </Typography>

                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5" align="Left" component="h5" gutterBottom >
                                                Cambiar contraseña
                                            </Typography>

                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    <TableRow>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} >

                                                <Typography variant="h6" component="h6" spacing={2}>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                <TextField
                                                    required
                                                    id="correo"
                                                    name="correo"
                                                    label="correo"
                                                    variant="outlined"
                                                    value={this.state.correo}
                                                    onChange={this.handleChange}
                                                    disabled={ReactSession.get("idRol")!==1}
                                                />
                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                {errors.correo.length > 0 &&
                                                    <span className='error'>{errors.correo}</span>}
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Stack direction="row" spacing={2} >

                                                <Typography variant="h6" component="h6" spacing={2}>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Contraseña Actual
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                <FormControl
                                                    variant="outlined"
                                                >
                                                    <InputLabel
                                                        htmlFor="password"
                                                        value={this.state.password}
                                                    >
                                                        Contraseña
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        fullWidth
                                                        label="Contraseña Actual"
                                                        id="password"
                                                        type="password"
                                                        name="password"
                                                        autoComplete="off"
                                                        value={this.state.password}
                                                        onChange={this.handleChange} 
                                                        disabled={ReactSession.get("email")!==this.state.correo}/>
                                                </FormControl>
                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                {errors.password.length > 0 &&
                                                    <span className='error'>{errors.password}</span>}
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
                                                    name="Nombres"
                                                    label="Nombres"
                                                    variant="outlined"
                                                    value={this.state.name}
                                                    disabled
                                                />
                                            </Stack>
                                            <br />
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} >

                                                <Typography variant="h6" component="h6" spacing={2}>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nueva Contraseña
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                <FormControl
                                                    variant="outlined"
                                                >
                                                    <InputLabel
                                                        htmlFor="newpassword"
                                                        value={this.state.newpassword}
                                                    >
                                                        Nueva Contraseña
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        fullWidth
                                                        label="Nueva Contraseña"
                                                        id="newpassword"
                                                        type="password"
                                                        name="newpassword"
                                                        autoComplete="off"
                                                        value={this.state.newpassword}
                                                        onChange={this.handleChange} />
                                                </FormControl>
                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                {errors.newpassword.length > 0 &&
                                                    <span className='error'>{errors.newpassword}</span>}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>
                                            <Stack direction="row" spacing={2} >

                                                <Typography variant="h6" component="h6" spacing={2}>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Confirmar Nueva Contraseña
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                <FormControl
                                                    variant="outlined"
                                                >
                                                    <InputLabel
                                                        htmlFor="confirmpassword"
                                                        value={this.state.confirmpassword}
                                                    >
                                                        Confirmar Nueva Contraseña
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        fullWidth
                                                        label="Confirmar Nueva Contraseña"
                                                        id="confirmpassword"
                                                        type="password"
                                                        name="confirmpassword"
                                                        autoComplete="off"
                                                        value={this.state.confirmpassword}
                                                        onChange={this.handleChange} />
                                                </FormControl>
                                            </Stack>
                                            <Stack direction="row" spacing={8} >
                                                <br />
                                                {errors.confirmpassword.length > 0 &&
                                                    <span className='error'>{errors.confirmpassword}</span>}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </Box>
                    <br />
                    <Box textAlign='center'>
                        <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={this.handleSubmit}>Confirmar Devolución</Button>
                    </Box>
                </Box >
            </div >
        );
    };
};

export default Perfil;
