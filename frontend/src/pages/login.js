import styles from "../styles/Login.module.css";
import { signIn, getCsrfToken } from "next-auth/react";
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
import { useRouter } from "next/router";
import Link from "next/link";

export default function Signin({ csrfToken }) {
  const router = useRouter();
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

    setErrors({
      username: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false,
    })
      .then((res) => {
        if (res.ok) {
          console.log("redirecting");
          router.back();
        } else {
          setErrors({ password: "Invalid username or password" });
        }
      })
      .catch((error) => {
        console.log(error);
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
          <form onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
              <TextField
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
              {"Don't have an account? Register "}
              <Link href="register" className={styles.link}>
                here
              </Link>
            </div>
            <FormControl sx={{ m: 1, width: "40ch" }}>
              <Button
                type="submit"
                sx={{ width: "100%" }}
                variant="contained"
                color="secondary"
              >
                Login
              </Button>
            </FormControl>
          </form>
        </Grid>
      </Paper>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
