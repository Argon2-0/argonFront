import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Avatar, TextField, makeStyles, Button } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import UserIcon from "@mui/icons-material/Person";
import PasswordIcon from "@mui/icons-material/Password";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Email } from "@material-ui/icons";
import '../../App.css';
import './Login.css';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import bcrypt from 'bcryptjs'
import Token from "../../Auth/Token";

const Login = () => {
  const rounds = 16;
  const paperStyle = {
    padding: 20,
    height: "60vh",
    width: 310,
    margin: "20px auto",
    background: `${"white"}`,
  };
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
      fetch(window.$basicUri + "userLogin/Login", {
        mode: "cors",
        method: "POST",
        body: JSON.stringify({
          email: email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (bcrypt.compareSync(password, json["password"])) {
            fetch(window.$basicUri + "userInfo/getByEmail", {
              mode: "cors",
              method: "POST",
              body: JSON.stringify({
                email: email,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((responseUserInfo) => responseUserInfo.json())
              .then((jsonUserInfo) => {
                window.$id = jsonUserInfo["id"];
                window.$name = jsonUserInfo["name"];
                window.$email = jsonUserInfo["email"];
                window.$foto = jsonUserInfo["picture"];
                window.$idRol = (jsonUserInfo["role"])["id"];
                window.$nameRol = (jsonUserInfo["role"])["name"];
              }).then(() => {
                token.generar();
              }).then(()=>{
                navigate("../Bio/public/home");
              })

          }
          else {
            console.log("incorrecto");
          }
          window.$token = json.token;
          console.log(json);
        }).catch((reason) => { console.log("no correo") })


    }

  };

  return (
    <div >
      <div className="verticalbar" />
      <div className="topbar"></div><Grid>
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
