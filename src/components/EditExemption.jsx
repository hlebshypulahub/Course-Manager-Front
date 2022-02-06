import React, { useState, useEffect, useCallback } from "react";
import MyTextField from "./MyTextField";
import MyDatePicker from "./MyDatePicker";
import MenuItem from "@mui/material/MenuItem";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import validator from "validator";

import { useHistory } from "react-router-dom";

import Spinner from "../components/Spinner";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormButtons from "./FormButtons";

import { getExemptions } from "../services/exemption.service";
import {
    getEmployeeById,
    patchEmployeeExemption,
} from "../services/employee.service";
import { ExemptionValidator as validateExemption } from "../helpers/ExemptionValidator";
import { FalseObjectChecker as isFalseObject } from "../helpers/FalseObjectChecker";
import { DateParser as parse } from "../helpers/DateParser";
import { DateFormatter as format } from "../helpers/DateFormatter";

import { banana_color } from "../helpers/color";
import "../css/Form.scss";

const EditExemption = (props) => {
    const id = props.match.params.id;
    const [exemptionIsLoaded, setExemptionLoaded] = useState(false);
    const [exemptionsIsLoaded, setExemptionsLoaded] = useState(false);
    const [exemption, setExemption] = useState({
        label: "",
        name: "",
        monthsDuration: "",
        monthsOfExemption: "",
    });
    const [exemptions, setExemptions] = useState([]);
    const [exemptionStartDate, setExemptionStartDate] = useState({});
    const [exemptionEndDate, setExemptionEndDate] = useState({});
    const [errors, setErrors] = useState({
        exemption: "",
        exemptionStartDate: "",
        exemptionEndDate: "",
    });
    const [fullName, setFullName] = useState("");

    const { user: currentUser } = useSelector((state) => state.auth);

    const history = useHistory();

    useEffect(() => {
        const fetchExemptions = () => {
            getExemptions().then((data) => {
                setExemptions(data);
                setExemptionsLoaded(true);
            });
        };

        fetchExemptions();
    }, []);

    const validate = useCallback(() => {
        const tempErrors = validateExemption(
            exemption,
            exemptionStartDate,
            exemptionEndDate
        );

        setErrors(tempErrors);

        return Object.values(tempErrors).every((item) => item === "");
    }, [exemption, exemptionStartDate, exemptionEndDate]);

    useEffect(() => {
        const fetchEmployee = () => {
            getEmployeeById(id).then((data) => {
                setFullName(data.fullName);
                setExemptionStartDate(parse(data.exemptionStartDate));
                setExemptionEndDate(data.exemptionEndDate);
                setExemption(data.exemption);
                setExemptionLoaded(true);
            });
        };

        fetchEmployee();
    }, [id]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (validate()) {
                const patch = {
                    ...(exemption && {
                        exemption: exemption.name,
                    }),
                    ...(exemptionStartDate && {
                        exemptionStartDate: format(exemptionStartDate),
                    }),
                    ...(validator.isDate(exemptionEndDate) && {
                        exemptionEndDate: format(exemptionEndDate),
                    }),
                };

                patchEmployeeExemption(id, patch).then(() => {
                    history.push({
                        pathname: `/employees/${id}`,
                        state: {
                            snackMessage: `Zwolnienie zostało zmienione`,
                        },
                    });
                });
            }
        },
        [id, exemption, exemptionStartDate, exemptionEndDate, history, validate]
    );

    useEffect(() => {
        validate();
    }, [validate]);

    const onChangeExemption = (e) => {
        const newExemptionLabel = e.target.value;

        const newExemption = exemptions.find(
            (ex) => ex.label === newExemptionLabel
        );

        setExemption(!isFalseObject(newExemption) ? newExemption : {});
    };

    const onChangeExemptionStartDate = (newExemptionStartDate) => {
        if (!newExemptionStartDate) {
            setErrors({
                ...errors,
                exemptionStartDate: "Należy podać datę początku zwolnienia",
            });

            return;
        }

        setExemptionStartDate(newExemptionStartDate);

        if (exemption.name === "LESS_THAN_YEAR_WORK") {
            let newExemptionEndDate = newExemptionStartDate;
            newExemptionEndDate.setFullYear(
                newExemptionEndDate.getFullYear() + 1
            );
            setExemptionEndDate(newExemptionEndDate);
        }
    };

    const onChangeExemptionEndDate = (newExemptionEndDate) => {
        setExemptionEndDate(newExemptionEndDate);

        if (exemption.name === "LESS_THAN_YEAR_WORK") {
            let newExemptionStartDate = newExemptionEndDate;
            newExemptionStartDate.setFullYear(
                newExemptionStartDate.getFullYear() - 1
            );
            setExemptionStartDate(newExemptionStartDate);
        }
    };

    if (!exemptionIsLoaded || !exemptionsIsLoaded) {
        return <Spinner />;
    }

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="Form">
            <Card className="card">
                <CardContent
                    className="card-content"
                    style={{
                        backgroundColor: banana_color,
                    }}
                >
                    <div className="card-label">
                        <span className="header-label">
                            Edytuj przyczynę zwolnienia
                        </span>
                    </div>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input text-field">
                            <MyTextField
                                disabled
                                label="Imię i nazwisko"
                                value={fullName ? fullName : ""}
                            />
                        </div>
                        <div className="input text-field">
                            <MyTextField
                                error={errors.exemption.length > 0}
                                helperText={errors.exemption}
                                select
                                value={exemption ? exemption.label : ""}
                                label="Przyczyna"
                                onChange={onChangeExemption}
                            >
                                {exemptions.map((type) => {
                                    return (
                                        <MenuItem
                                            key={type.name}
                                            value={type.label}
                                        >
                                            {type.label}
                                        </MenuItem>
                                    );
                                })}
                            </MyTextField>
                        </div>
                        <div className="input text-field">
                            <MyDatePicker
                                error={errors.exemptionStartDate.length > 0}
                                helperText={errors.exemptionStartDate.toString()}
                                label="Data początku"
                                value={exemptionStartDate}
                                onChange={onChangeExemptionStartDate}
                            />
                        </div>
                        <div className="input text-field">
                            <MyDatePicker
                                error={errors.exemptionEndDate.length > 0}
                                helperText={errors.exemptionEndDate.toString()}
                                label="Data końca"
                                value={exemptionEndDate}
                                onChange={onChangeExemptionEndDate}
                            />
                        </div>
                        <div className="buttons">
                            <FormButtons />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditExemption;
