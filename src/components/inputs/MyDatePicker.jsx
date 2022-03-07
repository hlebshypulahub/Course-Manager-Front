import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import MyTextField from "./MyTextField";
import MyTextFieldSmall from "./MyTextFieldSmall";

const MyDatePicker = ({ error, helperText, ...params }) => {
    const small = params.small;
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                {...params}
                mask="__.__.____"
                inputFormat="dd.MM.yyyy"
                inputProps={{
                    placeholder: "дд.мм.гггг",
                    helpertext: helperText,
                    iserror: error ? "true" : undefined,
                }}
                renderInput={(params) => {
                    return small ? (
                        <MyTextFieldSmall
                            {...params}
                            helperText={params.inputProps.helpertext}
                            error={params.inputProps.iserror === "true"}
                            onFocus={(event) => {
                                event.target.select();
                            }}
                        />
                    ) : (
                        <MyTextField
                            {...params}
                            helperText={params.inputProps.helpertext}
                            error={params.inputProps.iserror === "true"}
                            onFocus={(event) => {
                                event.target.select();
                            }}
                        />
                    );
                }}
            />
        </LocalizationProvider>
    );
};

export default MyDatePicker;
