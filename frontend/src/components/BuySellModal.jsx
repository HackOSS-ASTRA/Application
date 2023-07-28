import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useSession } from "next-auth/react";
import { useState } from "react";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const BuySellModal = ({ open, setOpen, modalData }) => {
  const { data: session } = useSession();
  const [totalCost, setTotalCost] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSerivirty, setAlertSevirity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const handleClose = () => {
    setError(false);
    setQuantity("");
    setTotalCost(0);
    setOpen(false);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowAlert(false);
  };

  const handleChange = (event) => {
    const val = event.target.value;
    if (val.match(/[^0-9]|.{10}/)) {
      return event.preventDefault();
    }
    setQuantity(val);
    setTotalCost((val * modalData.price).toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let mode = "sell";
    if (modalData.buy) mode = "buy";
    const url = process.env.NEXT_PUBLIC_SERVER_URL + `api/portfolio/${mode}/`;
    const payload = {
      asset: parseInt(modalData.asset),
      quantity: parseInt(quantity),
    };
    console.log(payload);

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${session.accessToken}`,
      },
    });

    setShowAlert(true);

    if (res.ok) {
      setAlertSevirity("success");
      setAlertMessage("Transaction Successful");
      setOpen(false);
      return;
    }

    const resJson = await res.json();
    console.log(resJson);
    setAlertSevirity("error");
    if (resJson.error) setAlertMessage(resJson.error);
    else setAlertMessage(resJson.quantity);
    setError(true);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity={alertSerivirty}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            {modalData.name}
          </Typography>
          {modalData.company}
          <Typography sx={{ mt: 2 }}>${modalData.price}</Typography>
          <br />
          Quantity:
          <form onSubmit={handleSubmit}>
            <FormControl
              sx={{ paddingTop: "10px", paddingBottom: "10px", width: "100%" }}
              variant="outlined"
            >
              <TextField
                error={error}
                inputProps={{ inputMode: "numeric" }}
                onChange={handleChange}
                value={quantity}
              ></TextField>
            </FormControl>
            Total Cost: ${totalCost}
            <FormControl
              sx={{ paddingTop: "10px", paddingBottom: "10px", width: "100%" }}
            >
              <Button type="submit" variant="contained" color="secondary">
                Confirm
                {modalData.buy ? " Buy" : " Sell"}
              </Button>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default BuySellModal;
