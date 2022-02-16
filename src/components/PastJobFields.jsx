import React, { useState, useEffect, useCallback } from "react";
import MyTextField from "./MyTextField";
import MyDatePicker from "./MyDatePicker";
import { FalseObjectChecker as isFalseObject } from "../helpers/FalseObjectChecker";
import validator from "validator";
import Button from "@mui/material/Button";

const PastJobFields = (props) => {
    const [index, setIndex] = useState(-1);
    const [isLast, setLast] = useState(false);

    useEffect(() => {
        setIndex(props.uniqueKey);
    }, [props.uniqueKey]);

    useEffect(() => {
        setLast(props.isLast);
    }, [props.isLast]);

    return (
        <>
            <div className="text-field" style={{ marginTop: "40px" }}>
                <MyTextField
                    label="Должность служащего, организация, индивидуальный предприниматель"
                    value={props.pastJob}
                    onChange={(e) => props.onChangePastJob(e, index)}
                />
            </div>

            <div className="combined-row" style={{ marginTop: "10px" }}>
                <span style={{ marginRight: "14px" }} className="text1">
                    C
                </span>

                <div
                    className="input text-field"
                    style={{ marginRight: "14px" }}
                >
                    <MyDatePicker
                        small={true}
                        key={index}
                        label=""
                        value={props.startDate}
                        onChange={(newStartDate) =>
                            props.onChangeStartDate(newStartDate, index)
                        }
                        error={
                            !isFalseObject(props.startDate) &&
                            !validator.isDate(props.startDate)
                        }
                        helperText={
                            isFalseObject(props.startDate) ||
                            validator.isDate(props.startDate)
                                ? ""
                                : "Неверный формат даты"
                        }
                    />
                </div>

                <span style={{ marginRight: "14px" }} className="text1">
                    По
                </span>

                <div className="input text-field">
                    <MyDatePicker
                        small={true}
                        label=""
                        value={props.endDate}
                        onChange={(newEndDate) =>
                            props.onChangeEndDate(newEndDate, index)
                        }
                        error={
                            !isFalseObject(props.endDate) &&
                            !validator.isDate(props.endDate)
                        }
                        helperText={
                            isFalseObject(props.endDate) ||
                            validator.isDate(props.endDate)
                                ? ""
                                : "Неверный формат даты"
                        }
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
                        onClick={props.extend}
                    >
                        Еще
                    </Button>
                )}
            </div>
        </>
    );
};

export default PastJobFields;
