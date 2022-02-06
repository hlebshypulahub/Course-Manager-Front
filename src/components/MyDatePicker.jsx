import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MyTextField from "./MyTextField";

const MyDatePicker = ({ error, helperText, ...params }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                {...params}
                mask="__.__.____"
                inputFormat="dd.MM.yyyy"
                inputProps={{
                    placeholder:"dd.mm.rrrr",
                    helpertext: helperText,
                    iserror: error ? "true" : undefined,
                }}
                renderInput={(params) => (
                    <MyTextField
                        {...params}
                        helperText={params.inputProps.helpertext}
                        error={params.inputProps.iserror === "true"}
                        onFocus={(event) => {
                            event.target.select();
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    );
};

export default MyDatePicker;
