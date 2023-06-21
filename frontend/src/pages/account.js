import styles from "../styles/Account.module.css";
import Sidebar from "@/components/Sidebar";
import {
  Avatar,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import { getSession, useSession } from "next-auth/react";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const url = process.env.NEXT_PUBLIC_SERVER_URL + "api/user_account/details";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Context-Type": "application/json",
      Authorization: `Token ${session.accessToken}`,
    },
  });
  const result = await response.json();
  return {
    props: {
      data: result,
    },
  };
}
const CustomTextField = (props) => {
  const { setField, field, data, disabled, errors, label } = props;
  return (
    <Stack direction="row" spacing={2}>
      <Grid item xs={3}>
        <p>{label}</p>
      </Grid>

      <Grid item xs={6}>
        <FormControl sx={{ m: 1, width: "40ch", paddingTop: "-5px" }}>
          <TextField
            helperText={errors[field]}
            disabled={disabled}
            defaultValue={data[field]}
            size="small"
            variant="outlined"
            id={field}
            type="text"
            inputProps={{ style: { fontSize: "16px" } }}
            onChange={(e) => {
              if (!disabled) setField(field, e.target.value);
            }}
          ></TextField>
        </FormControl>
      </Grid>
    </Stack>
  );
};

export default function Account(props) {
  const { data } = props;
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(data);
  const [errors, setErrors] = useState({});
  const { data: session } = useSession();
  const router = useRouter();
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    setErrors({});
  };
  const submitEdit = async (e) => {
    e.preventDefault();
    const { username, id, ...payload } = form;
    const url = process.env.NEXT_PUBLIC_SERVER_URL + "api/user_account/update/";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${session.accessToken}`,
      },
    });
    const responseData = await res.json();
    if (res.ok) {
      router.replace(router.asPath);
      setEditMode(false);
      setErrors({});
    } else {
      setErrors(responseData);
    }
  };

  if (editMode) {
    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar></Sidebar>
        <Paper elevation={3} className={styles.paperStyle}>
          <form onSubmit={submitEdit}>
            <Button type="submit" className={styles.editButton}>
              <DoneIcon />
              Apply
            </Button>
            <Grid container>
              <Grid item xs={1} />
              <Grid item xs={6}>
                <Box sx={{ paddingTop: "20px" }} />
                <CustomTextField
                  label="Username:"
                  errors={errors}
                  disabled
                  setField={setField}
                  field="username"
                  data={data}
                ></CustomTextField>
                <CustomTextField
                  label="First name:"
                  errors={errors}
                  setField={setField}
                  field="first_name"
                  data={data}
                ></CustomTextField>
                <CustomTextField
                  label="Last name:"
                  errors={errors}
                  setField={setField}
                  field="last_name"
                  data={data}
                ></CustomTextField>
                <CustomTextField
                  label="Email:"
                  errors={errors}
                  setField={setField}
                  field="email"
                  data={data}
                ></CustomTextField>
                <CustomTextField
                  label="Mobile Number:"
                  errors={errors}
                  setField={setField}
                  field="mobile_number"
                  data={data}
                ></CustomTextField>
                <CustomTextField
                  label="Date of Birth:"
                  errors={errors}
                  setField={setField}
                  field="date_of_birth"
                  data={data}
                ></CustomTextField>
                <CustomTextField
                  label="Joined since:"
                  errors={errors}
                  setField={setField}
                  field="date_joined"
                  data={data}
                ></CustomTextField>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    );
  }
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar></Sidebar>
      <Paper elevation={3} className={styles.paperStyle}>
        <Button
          className={styles.editButton}
          onClick={() => {
            setEditMode(true);
          }}
        >
          <EditIcon />
          Edit
        </Button>
        <Grid container>
          <Grid item xs={1}></Grid>
          <Grid item xs={2}>
            <p>Username:</p>
            <p>First Name:</p>
            <p>Last Name:</p>
            <p>Email:</p>
            <p>Mobile:</p>
            <p>Date of Birth:</p>
            <p>Joined since:</p>
          </Grid>
          <Grid item xs={6}>
            <p>
              {data.username} <br />
            </p>
            <p>
              {data.first_name} <br />
            </p>
            <p>
              {data.last_name} <br />
            </p>
            <p>
              {data.email} <br />
            </p>
            <p>
              {data.mobile_number} <br />
            </p>
            <p>
              {data.date_of_birth} <br />
            </p>
            <p>
              {data.date_joined} <br />
            </p>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

Account.useAuth = true;
