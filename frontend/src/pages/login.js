import styles from "../styles/Login.module.css";
import {
  Typography,
  Box,
  Avatar,
  Paper,
  Grid,
  FormControl,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const { push } = useRouter();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: "",
      });
    console.log(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/auth/login/", form)
      .then(function (response) {
        push("/");
      })
      .catch(function (error) {
        let data = error.response.data;
        error = {
          username: "",
          password: "",
        };
        if (data.hasOwnProperty("username"))
          error["username"] = data["username"];
        if (data.hasOwnProperty("password"))
          error["password"] = data["password"];
        if (data.hasOwnProperty("non_field_errors"))
          error["password"] = data["non_field_errors"];
        setErrors(error);
      });
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div>
      <Paper elevation={3} className={styles.paperStyle}>
        <Grid align="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Avatar
              sx={{ width: 50, height: 50, display: "inline-block" }}
              alt="none"
              src="/logo.jpeg"
            />
            <Typography
              variant="h3"
              sx={{
                mr: 2,
                display: "flex",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              ASTRA
            </Typography>
          </Box>
          <h2 style={{ fontSize: "30px", margin: "10px" }}>
            Welcome to ASTRA!
          </h2>
          <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
            <TextField
              error={errors["username"] !== ""}
              helperText={errors["username"]}
              id="username"
              type="text"
              label="Username"
              onChange={(e) => {
                setField("username", e.target.value);
              }}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
            <TextField
              error={errors["password"] !== ""}
              helperText={errors["password"]}
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              label="Password"
              onChange={(e) => {
                setField("password", e.target.value);
              }}
            />
          </FormControl>
          <div>
            Don't have an account? Register{" "}
            <Link href="register" className={styles.link}>
              here
            </Link>
          </div>
          <FormControl sx={{ m: 1, width: "40ch" }}>
            <Button
              sx={{ width: "100%" }}
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              Login
            </Button>
          </FormControl>
        </Grid>
      </Paper>
    </div>
  );
}
