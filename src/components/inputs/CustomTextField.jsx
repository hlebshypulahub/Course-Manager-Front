import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";



const CustomTextField = (params) => {
    const width = params.width;

    params = {
        ...params,
        id: "custom-css-outlined-input",
        variant: "outlined",
    };

    const StyledTextField = styled(TextField)({
        "& label": {
            color: "black",
        },
        "& .MuiOutlinedInput-root": {
            width: width,

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
            width: width,

            "& fieldset": {
                border: "2px solid",
            },
        },
    });

    return params.disabled ? (
        <StyledTextFieldDisabled {...params} />
    ) : (
        <StyledTextField {...params} />
    );
};

export default CustomTextField;
