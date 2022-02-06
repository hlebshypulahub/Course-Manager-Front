import React, { useState, useEffect, useCallback } from "react";
import MyTextField from "./MyTextField";
import MyDatePicker from "./MyDatePicker";
import MenuItem from "@mui/material/MenuItem";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import { useHistory } from "react-router-dom";

import Spinner from "../components/Spinner";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormButtons from "./FormButtons";

import { getEducations } from "../services/education.service";
import {
    getEmployeeById,
    patchEmployeeEducation,
} from "../services/employee.service";
import { EducationValidator as validateEducation } from "../helpers/EducationValidator";
import { FalseObjectChecker as isFalseObject } from "../helpers/FalseObjectChecker";
import { DateParser as parse } from "../helpers/DateParser";
import { DateFormatter as format } from "../helpers/DateFormatter";

import { banana_color } from "../helpers/color";
import "../css/Form.scss";

const EditEducation = (props) => {
    const id = props.match.params.id;
    const [educationLoaded, setEducationLoaded] = useState(false);
    const [educationsLoaded, setEducationsLoaded] = useState(false);
    const [education, setEducation] = useState({
        label: "",
        name: "",
        requiredHoursNoneCategory: "",
        requiredHours: "",
    });
    const [educations, setEducations] = useState([]);
    const [eduName, setEduName] = useState("");
    const [fullName, setFullName] = useState("");
    const [eduGraduationDate, setEduGraduationDate] = useState({});
    const [errors, setErrors] = useState({
        education: "",
        eduName: "",
        eduGraduationDate: "",
    });
    const { user: currentUser } = useSelector((state) => state.auth);

    const history = useHistory();

    useEffect(() => {
        const fetchEducations = () => {
            getEducations().then((data) => {
                setEducations(data);
                setEducationsLoaded(true);
            });
        };

        fetchEducations();
    }, []);

    const validate = useCallback(() => {
        const tempErrors = validateEducation(
            education,
            eduName,
            eduGraduationDate
        );

        setErrors(tempErrors);

        return Object.values(tempErrors).every((item) => item === "");
    }, [education, eduName, eduGraduationDate]);

    useEffect(() => {
        const fetchEmployee = () => {
            getEmployeeById(id).then((data) => {
                setFullName(data.fullName);
                setEduGraduationDate(parse(data.eduGraduationDate));
                setEduName(data.eduName);
                setEducation(data.education);
                setEducationLoaded(true);
            });
        };

        fetchEmployee();
    }, [id]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (validate()) {
                const patch = {
                    ...(eduName && { eduName }),
                    ...(eduGraduationDate && {
                        eduGraduationDate: format(eduGraduationDate),
                    }),
                    ...(education && { education: education.name }),
                };

                patchEmployeeEducation(id, patch).then(() => {
                    history.push({
                        pathname: `/employees/${id}`,
                        state: {
                            snackMessage: `Wykształcenie zostało zmienione`,
                        },
                    });
                });
            }
        },
        [id, eduName, eduGraduationDate, education, history, validate]
    );

    useEffect(() => {
        validate();
    }, [validate]);

    const onChangeEduName = (e) => {
        const newName = e.target.value;
        setEduName(newName);
    };

    const onChangeEducation = (e) => {
        const newEducationLabel = e.target.value;
        const newEducation = educations.find(
            (c) => c.label === newEducationLabel
        );
        setEducation(!isFalseObject(newEducation) ? newEducation : {});
    };

    const onChangeEduGraduationDate = (newEduGraduationDate) => {
        if (!newEduGraduationDate) {
            setErrors({
                ...errors,
                eduGraduationDate: "Należy podać datę ukończenia stodiów",
            });
        }
        setEduGraduationDate(newEduGraduationDate);
    };

    if (!educationLoaded || !educationsLoaded) {
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
                            Edytuj wykształcenie
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
                                error={errors.education.length > 0}
                                helperText={errors.education}
                                select
                                value={education ? education.label : ""}
                                label="Rodzaj"
                                onChange={onChangeEducation}
                            >
                                {educations.map((type) => {
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
                            <MyTextField
                                error={errors.eduName.length > 0}
                                helperText={errors.eduName}
                                label="Nazwa szkoły"
                                value={eduName ? eduName : ""}
                                onChange={onChangeEduName}
                            />
                        </div>
                        <div className="input text-field">
                            <MyDatePicker
                                error={errors.eduGraduationDate.length > 0}
                                helperText={errors.eduGraduationDate.toString()}
                                label="Data zakończenia"
                                value={eduGraduationDate}
                                onChange={onChangeEduGraduationDate}
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

export default EditEducation;
