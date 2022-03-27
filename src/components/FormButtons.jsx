//// React

import { useHistory } from "react-router-dom";

//// Mui
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

//// Utils
import { green, red } from "../helpers/color";

const FormButtons = ({
    onlySubmit,
    cancelFunc,
    cancelText,
    acceptText,
    submitting,
}) => {
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
            <LoadingButton
                loading={submitting}
                loadingPosition="end"
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
            </LoadingButton>
        </>
    );
};

export default FormButtons;
