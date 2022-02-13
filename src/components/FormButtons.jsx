import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import { green, red } from "../helpers/color";

const FormButtons = (props) => {
    const history = useHistory();

    return (
        <>
            {!props.onlySubmit && (
                <Button
                    variant="contained"
                    endIcon={<CancelIcon />}
                    style={{
                        backgroundColor: red,
                        color: "white",
                        fontWeight: "bold",
                        height: "40px",
                    }}
                    onClick={
                        props.cancelFunc
                            ? () => {
                                  props.cancelFunc();
                              }
                            : () => {
                                  history.goBack();
                              }
                    }
                >
                    {props.cancelText ? props.cancelText : "Отменить"}
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
                {props.acceptText ? props.acceptText : "Подтвердить"}
            </Button>
        </>
    );
};

export default FormButtons;
