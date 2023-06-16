import { Box, TextField, Typography } from "@mui/material";
import { GridToolbar, DataGrid, useGridApiRef } from "@mui/x-data-grid";
import React, { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import './CrearUsuario.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Role } from "../../../Data/Role";
import { useEffect } from "react";
import { InputLabel, Menu, NativeSelect } from "@material-ui/core";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import '../../../App.css'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import bcrypt from 'bcryptjs'

const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};
const rounds = 16;
class CrearUsuario extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: [""],
            nombres: "",
            email: "",
            rol: "",
            password: "",
            confirmPassword: "",
            errors: {
                nombres: "",
                email: "",
                rol: "",
                password: "",
                confirmPassword: ""
            }
        };
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        this.validations(name, value);
    }

    validations = (name, value) => {
        let errors = this.state.errors;
        switch (name) {
            case 'nombres':
                errors.nombres =
                    value.length < 5
                        ? 'Full Name must be at least 5 characters long!'
                        : '';
                break;
            case 'email':
                errors.email =
                    validEmailRegex.test(value)
                        ? ''
                        : 'Email is not valid!';
                break;
            case 'rol':
                errors.rol =
                    value === ""
                        ? 'Should select a role!'
                        : '';
                break;
            case 'password':
                errors.password =
                    value.length < 8
                        ? 'Password must be at least 8 characters long!'
                        : '';
                break;
            case 'confirmPassword':
                errors.confirmPassword =
                    value !== this.state["password"]
                        ? 'Passwords should be equals!'
                        : value.length < 8
                            ? 'Password must be at least 8 characters long!'
                            : '';

                break;
            default:
                break;
        }
        this.setState({ errors, [name]: value });

    }

    handleSubmit = (e) => {
        const fields = ["nombres", "email", "rol", "password", "confirmPassword"];
        e.preventDefault();
        fields.forEach(field => {
            this.validations(field, this.state[field]);
        });
        if (validateForm(this.state.errors)) {
            console.info('Valid Form')
            fetch(window.$basicUri + "/user/create", {
                mode: "cors",
                method: "POST",
                body: JSON.stringify({
                    name: this.state.nombres,
                    email: this.state.email,
                    password: bcrypt.hashSync(this.state.password, rounds),
                    role: {
                        id: this.state.rol,
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
            "role/getAll",
            {
                mode: "cors",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((response) => response.json())
            .then((json) => {
                let rolesJson = [];
                for (let pos = 0; pos < json.length; pos++) {
                    json[pos]['createdAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(json[pos]['createdAt']));
                    json[pos]['updatedAt'] = new Date(new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(json[pos]['updatedAt']));
                    rolesJson.push(new Role(
                        json[pos]['id'],
                        json[pos]['name'],
                        json[pos]['description'],
                        json[pos]['createdAt'],
                        json[pos]['updatedAt']));
                }
                this.setState({ ["roles"]: rolesJson });
            })
    };
    render() {
        const { errors } = this.state;
        return (
            <div className="sizer">

                <Box className="cardout">
                    <Typography variant="h4" component="h4" gutterBottom>
                        Crear usuario
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Box className="cardin">
                                            <Typography variant="h5" align="center" component="h5" gutterBottom>
                                                INFORMACION DEL USUARIO
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
                                                                        id="Email"
                                                                        name="email"
                                                                        type="email"
                                                                        value={this.state.email}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    />

                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.email.length > 0 &&
                                                                        <span className='error'>{errors.email}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h6" component="h6" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rol
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <Select
                                                                        required
                                                                        id="Rol"
                                                                        name="rol"
                                                                        value={this.state.rol}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    >
                                                                        if(this.state.roles !== [""]){
                                                                            this.state.roles?.map((element, index) => {
                                                                                return (
                                                                                    <MenuItem key={index} value={element?.id} width="300">{element?.name}</MenuItem>

                                                                                );
                                                                            })}
                                                                    </Select>

                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.rol.length > 0 &&
                                                                        <span className='error'>{errors.rol}</span>}
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>

                                                                <Stack direction="row" spacing={2} >

                                                                    <Typography variant="h6" component="h6" spacing={2}>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Contraseña
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="Password"
                                                                        name="password"
                                                                        type="password"
                                                                        value={this.state.password}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    />

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
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Confirmar contraseña
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    <TextField
                                                                        required
                                                                        id="ConfirmPassword"
                                                                        name="confirmPassword"
                                                                        type="password"
                                                                        value={this.state.confirmPassword}
                                                                        onChange={this.handleChange}
                                                                        style={{ width: 300 }}
                                                                    />

                                                                </Stack>
                                                                <Stack direction="row" spacing={8} >
                                                                    <br />
                                                                    {errors.confirmPassword.length > 0 &&
                                                                        <span className='error'>{errors.confirmPassword}</span>}
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
                        <Button className="button" variant="contained" endIcon={<SendIcon />} onClick={this.handleSubmit}>Crear usuario</Button>

                    </Box>
                </Box>
            </div>
        );
    }
};

export default CrearUsuario;
