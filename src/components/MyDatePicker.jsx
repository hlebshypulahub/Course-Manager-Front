import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MyTextField from "./MyTextField";
import CustomTextField from "./CustomTextField";

const MyDatePicker = ({ error, helperText, ...params }) => {
    const width = params.width;

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
                renderInput={(params) =>
                    width ? (
                        <CustomTextField
                            width={width}
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
                    )
                }
            />
        </LocalizationProvider>
    );
};

export default MyDatePicker;
