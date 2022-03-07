//// React
import React from "react";
import { useHistory } from "react-router-dom";

//// Mui
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";

//// Utils
import { green, red } from "../helpers/color";

const FormButtons = ({ onlySubmit, cancelFunc, cancelText, acceptText }) => {
    const history = useHistory();

    return (
        <>
            {!onlySubmit && (
                <Button
                    variant="contained"
                    endIcon={<CancelIcon />}
                    type="button"
                    style={{
                        backgroundColor: red,
                        color: "white",
                        fontWeight: "bold",
                        height: "40px",
                    }}
                    onClick={
                        cancelFunc
                            ? () => {
                                  cancelFunc();
                              }
                            : () => {
                                  history.goBack();
                              }
                    }
                >
                    {cancelText || "Отменить"}
                </Button>
            )}
            <Button
                variant="contained"
                endIcon={<CheckCircleIcon />}
                style={{
                    marginLeft: "30px",
                    backgroundColor: green,
                    color: "white",
                    fontWeight: "600",
                    height: "40px",
                }}
                type="submit"
            >
                {acceptText || "Подтвердить"}
            </Button>
        </>
    );
};

export default FormButtons;
