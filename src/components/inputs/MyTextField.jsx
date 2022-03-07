import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

const StyledTextField = styled(TextField)({
    "& label": {
        color: "black",
    },
    "& .MuiOutlinedInput-root": {
        width: "750px",

        "& fieldset": {
            border: "2px solid #A7A7FF",
        },
        "&:hover fieldset": {
            border: "2px solid #272793",
        },
        "&.Mui-focused fieldset": {
            border: "3px solid #272793",
        },
    },
});

const StyledTextFieldDisabled = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        width: "750px",

        "& fieldset": {
            border: "2px solid",
        },
    },
});

const MyTextField = (params) => {
    params = {
        ...params,
        id: "custom-css-outlined-input",
        variant: "outlined",
    };

    return params.disabled ? (
        <StyledTextFieldDisabled {...params} />
    ) : (
        <StyledTextField {...params} />
    );
};

export default MyTextField;
