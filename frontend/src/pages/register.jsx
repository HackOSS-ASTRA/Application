import styles from "../styles/Register.module.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Register() {
  const { data: session, status } = useSession();
  const { push } = useRouter();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({
    username: "",
    password1: "",
    password2: "",
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
  };

  useEffect(() => {
    if (status == "authenticated") {
      push("/trading/most_traded");
    }
  }, [status, push]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = process.env.NEXT_PUBLIC_SERVER_URL + "api/auth/register/";
    console.log(url);
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) push("/login");
    else {
      let data = await res.json();
      const error = {
        username: "",
        password1: "",
        password2: "",
      };
      if (data.hasOwnProperty("username")) error["username"] = data["username"];
      if (data.hasOwnProperty("password1"))
        error["password1"] = data["password1"];
      if (data.hasOwnProperty("password2"))
        error["password2"] = data["password2"];
      if (data.hasOwnProperty("non_field_errors"))
        error["password2"] = data["non_field_errors"];
      setErrors(error);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div>
      <Paper
        sx={{ backgroundColor: "primary.main" }}
        elevation={3}
        className={styles.paperStyle}
      >
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
          <h3>Register an account now!</h3>
          <form onSubmit={handleSubmit}>
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
                error={errors["password1"] !== ""}
                helperText={errors["password1"]}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
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
                }
                label="Password"
                onChange={(e) => {
                  setField("password1", e.target.value);
                }}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
              <TextField
                error={errors["password2"] !== ""}
                helperText={errors["password2"]}
                id="password-confirm"
                type={showPassword ? "text" : "password"}
                label="Comfirm password"
                onChange={(e) => {
                  setField("password2", e.target.value);
                }}
              />
            </FormControl>
            <div>
              Already have an account? Login{" "}
              <Link href="login" className={styles.link}>
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
                Register
              </Button>
            </FormControl>
          </form>
        </Grid>
      </Paper>
    </div>
  );
}
