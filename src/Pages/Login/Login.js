import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Avatar, TextField, Button } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import PasswordIcon from "@mui/icons-material/Password";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Email } from "@material-ui/icons";
import '../../App.css';
import './Login.css';
import { TableContainer, Table, TableRow, TableCell, TableBody } from '@mui/material';
import Token from "../../Auth/Token";
import Protege from "../../Auth/Protege";
import { ReactSession } from 'react-client-session';

const Login = () => {
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate("");

  const handlePassword = (e) => {
    const { value } = e.currentTarget;
    setPassword(value);
  };
  const handleEmail = (e) => {
    const { value } = e.currentTarget;
    setEmail(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var token = new Token();
    if (email !== "" && password !== "") {
      Protege(password).then(response => {
        fetch(ReactSession.get("basicUri") + "userLogin/Login", {
          mode: "cors",
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: response.toString()
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) =>
            (response.json())
          ).then((responseUserInfo) => {
            ReactSession.set("id", responseUserInfo["id"]);
            ReactSession.set("name", responseUserInfo["name"]);
            ReactSession.set("email", responseUserInfo["email"]);
            ReactSession.set("idRol", (responseUserInfo["role"])["id"]);
            ReactSession.set("nameRol", (responseUserInfo["role"])["name"]);
            ReactSession.set("foto", responseUserInfo["picture"]);
          }).then(() => {
            token.generar();
          }).then(() => {
            ReactSession.set("currentTime", Date.now());
            navigate("../Bio/public/home");
          })

      })

    }

  };

  return (
    <div className="side" style={{ backgroundImage: `url('/images/colsubsidio.png')`, backgroundSize: "95%", height: "300%", backgroundPositionX: "245px", backgroundPositionY: "-50px", backgroundRepeat: "no-repeat" }}>
      <div className="verticalbar" />
      <div className="topbar">© 2023<a href="https://www.vision2cloud.com/" target="_blank" rel="noreferrer">
        Vision2Cloud
      </a></div>
      <Grid>
        <form onSubmit={handleSubmit} className="sizer position spaceLogin">
          <div className="cardout " >
            <Grid align="center">
              <Avatar style={avatarStyle}>
                <LockOutlinedIcon />
              </Avatar>
              <h2>
                Iniciar Sesion
              </h2>
            </Grid>
            <br />
            <center>
              <div className="cardin">
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <ListItemIcon>
                            <Email />{" "}
                          </ListItemIcon>
                        </TableCell>
                        <TableCell>
                          <TextField
                            variant="outlined"
                            id="email"
                            name="email"
                            label="email"
                            type="email"
                            value={email}
                            onChange={handleEmail} />
                        </TableCell>

                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <ListItemIcon>
                            <PasswordIcon />{" "}
                          </ListItemIcon>
                        </TableCell>
                        <TableCell>
                          <FormControl
                            variant="outlined"
                          >
                            <InputLabel
                              htmlFor="outlined-adornment-password"
                              value={password}
                            >
                              Password
                            </InputLabel>
                            <OutlinedInput
                              fullWidth
                              label="Password"
                              id="outlined-adornment-password-login"
                              type="password"
                              name="password"
                              autoComplete="off"
                              value={password}
                              onChange={handlePassword} />
                          </FormControl>
                          <br />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </center>
            <br />
            <center>
              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                Sign in
              </Button>
            </center>
          </div>
        </form>
      </Grid></div>
  );
};

export default Login;
