import MyTextField from "./MyTextField";
import MyDatePicker from "./MyDatePicker";
import Button from "@mui/material/Button";
import { softValidate } from "../helpers/DateValidator";

const PastJobFields = ({
    pastJob,
    uniqueKey,
    isLast,
    onChangePastJob,
    onChangeStartDate,
    onChangeEndDate,
    startDate,
    endDate,
    extend,
    customMarginRight,
}) => {
    return (
        <>
            <div className="text-field" style={{ marginTop: "40px" }}>
                <MyTextField
                    label="Должность служащего, организация, индивидуальный предприниматель"
                    value={pastJob}
                    onChange={(e) => onChangePastJob(e, uniqueKey)}
                />
            </div>

            <div className="combined-row" style={{ marginTop: "10px" }}>
                <span style={customMarginRight} className="text1">
                    C
                </span>

                <div className="input text-field" style={customMarginRight}>
                    <MyDatePicker
                        small={true}
                        // key={uniqueKey}
                        label=""
                        value={startDate}
                        onChange={(newStartDate) =>
                            onChangeStartDate(newStartDate, uniqueKey)
                        }
                        error={!!softValidate(endDate)}
                        helperText={softValidate(startDate)}
                    />
                </div>

                <span style={customMarginRight} className="text1">
                    По
                </span>

                <div className="input text-field">
                    <MyDatePicker
                        small={true}
                        label=""
                        value={endDate}
                        onChange={(newEndDate) =>
                            onChangeEndDate(newEndDate, uniqueKey)
                        }
                        error={!!softValidate(endDate)}
                        helperText={softValidate(endDate)}
                    />
                </div>

                {isLast && (
                    <Button
                        variant="outlined"
                        style={{
                            fontWeight: "bold",
                            display: "inline",
                            marginTop: "14px",
                            marginLeft: "194px",
                        }}
                        size="large"
                        type="button"
                        onClick={extend}
                    >
                        Еще
                    </Button>
                )}
            </div>
        </>
    );
};

export default PastJobFields;
