import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import '../../App.css'
import Swal from "sweetalert2";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';


const Perfil = () => {

    const handleChange = e => {
        const { name, value } = e.target;
    };
    const [open, setOpen] = useState(false);

    const handleSubmit = (e) => {
        let body = {}
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        body = {
            nombre: data.get("vacuna")
        }
        var req = new XMLHttpRequest();
        req.open('POST', window.$url + '/insertTipoVacunaVPH', true);
        req.body = body;
        req.send(JSON.stringify(body));
        Swal.fire("Succes", "Vacuna creada exitosamente", "success");

    };
    return (
        <div className="RegisterComponent">

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} className="cardout">

                <Typography variant="h4" align="Left" component="h4" gutterBottom className="letras">
                    Editar perfil
                </Typography>
                <TableContainer className="letras">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h5" align="Left" component="h5" gutterBottom className="letras">
                                        Información del usuario
                                    </Typography>

                                </TableCell>
                                <TableCell>
                                    <Typography variant="h5" align="Left" component="h5" gutterBottom className="letras">
                                        Cambiar contraseña
                                    </Typography>

                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} className="cardin">

                                        <Stack direction="row" spacing={2} >

                                            <Typography variant="h6" component="h6" spacing={2}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nombres
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={4} >
                                            <br />
                                            <TextField
                                                required
                                                id="Nombres"
                                                name="Nombres"
                                                label="Nombres"
                                                variant="outlined"
                                            />
                                        </Stack>
                                        <br />
                                        <Stack direction="row" spacing={2} >

                                            <Typography variant="h6" component="h6" spacing={2}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={4} >
                                            <br />
                                            <TextField
                                                required
                                                id="Email"
                                                name="Email"
                                                label="Email"
                                                variant="outlined"
                                            />
                                        </Stack>
                                        <br />
                                        <Box textAlign='center'>
                                            <Button type="submit" class="button" variant="contained" endIcon={<SendIcon />}>Guardar cambios</Button>

                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} className="cardin">



                                        <Stack direction="row" spacing={2} >

                                            <Typography variant="h6" component="h6" spacing={2}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Contraseña Actual
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={4} >
                                            <br />
                                            <TextField
                                                required
                                                id="ContraseñaActual"
                                                name="ContraseñaActual"
                                                label="Contraseña Actual"
                                                variant="outlined"
                                            />
                                        </Stack>
                                        <br />
                                        <Stack direction="row" spacing={2} >

                                            <Typography variant="h6" component="h6" spacing={2}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nueva Contraseña
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={4} >
                                            <br />
                                            <TextField
                                                required
                                                id="NuevaContraseña"
                                                name="NuevaContraseña"
                                                label="Nueva Contraseña"
                                                variant="outlined"
                                            />
                                        </Stack>
                                        <br />
                                        <Stack direction="row" spacing={2} >

                                            <Typography variant="h6" component="h6" spacing={2}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Confirmar Nueva Contraseña
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={4} >
                                            <br />
                                            <TextField
                                                required
                                                id="ConfirmarNuevaContraseña"
                                                name="ConfirmarNuevaContraseña"
                                                label="Confirmar Nueva Contraseña"
                                                variant="outlined"
                                            />
                                        </Stack>
                                        <br />
                                        <Box textAlign='center'>
                                            <Button type="submit" class="button" variant="contained" endIcon={<SendIcon />}>Cambiar Contraseña</Button>

                                        </Box>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
};

export default Perfil;
