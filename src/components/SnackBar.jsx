import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const SnackBar = ({ open, handleClose, message }) => {
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return (
        <Snackbar
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            open={open}
            autoHideDuration={10000}
            onClose={handleClose}
        >
            <Alert
                onClose={handleClose}
                severity="success"
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackBar;
