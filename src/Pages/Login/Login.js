import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Avatar, TextField, makeStyles,Button } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import UserIcon from "@mui/icons-material/Person";
import PasswordIcon from "@mui/icons-material/Password";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Email } from "@material-ui/icons";

const Login = () => {
    const paperStyle = {
        padding: 20,
        height: "60vh",
        width: 310,
        margin: "20px auto",
        background: `${"white"}`,
      };
      const avatarStyle = { backgroundColor: "#1bbd7e" };
      const [password, setPassword] = useState("");
      let navigate = useNavigate("");
    
      const handlePassword = (e) => {
        const { value } = e.currentTarget;
        setPassword(value);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        /*if (data.get("email") !== "" && data.get("password") !== "") {
          fetch(window.$social + "/auth", {
            mode: "cors",
            method: "POST",
            body: JSON.stringify({
              email: data.get("email"),
              password: data.get("password"),
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((json) => {
              window.$token = json.token;
              console.log(json);
              let pos = data.get("unidadvivienda");
    
              window.$usuario = "";
              navigate("../home");
            });
            
        }*/
        navigate("../Bio/public/home");
      };

    return (
        <Grid>
          <form onSubmit={handleSubmit} className="">
            <Paper elevation={10} style={paperStyle} className="card">
              <Grid align="center">
                <Avatar style={avatarStyle}>
                  <LockOutlinedIcon />
                </Avatar>
                <h2 >
                  Iniciar Sesion
                </h2>
              </Grid>
              <div>
                <div>
                  <ListItemIcon>
                    <Email
                    />{" "}
                  </ListItemIcon>
                  <TextField
                    variant="outlined"
                    id="email"
                    name="email"
                    label="email"
                    type="email"
                  />
                </div>
                <br></br>
                <div>
                  <ListItemIcon>
                    <PasswordIcon
                    />{" "}
                  </ListItemIcon>
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
                      onChange={handlePassword}
                    />
                  </FormControl>
                </div>
                <br />
               
              </div>
              <br />
              <br />
              <br />
              <center>
              <Button
                type="submit"
                variant="contained"
              >
                Sign in
              </Button>
              </center>
            </Paper>
          </form>
        </Grid>
      );
};

export default Login;
