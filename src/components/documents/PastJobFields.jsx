import MyTextField from "../inputs/MyTextField";
import MyDatePicker from "../inputs/MyDatePicker";
import Button from "@mui/material/Button";
import { dateIsBlank } from "../../helpers/date-is-blank";

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
    const extendButton = isLast && (
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
    );

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
                        label=""
                        value={startDate}
                        onChange={(newStartDate) =>
                            onChangeStartDate(newStartDate, uniqueKey)
                        }
                        error={!!dateIsBlank(endDate)}
                        helperText={dateIsBlank(startDate)}
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
                        error={!!dateIsBlank(endDate)}
                        helperText={dateIsBlank(endDate)}
                    />
                </div>

                {extendButton}
            </div>
        </>
    );
};

export default PastJobFields;
