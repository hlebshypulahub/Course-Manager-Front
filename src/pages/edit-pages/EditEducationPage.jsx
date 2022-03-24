//// React
import React, { useState, useEffect, useCallback } from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

//// Components
import MyTextField from "../../components/inputs/MyTextField";
import MyDatePicker from "../../components/inputs/MyDatePicker";
import Spinner from "../../components/spinner/Spinner";
import FormButtons from "../../components/FormButtons";

//// Mui
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//// Functions
import { getEducations } from "../../services/education.service";
import {
    getEmployeeById,
    patchEmployeeEducation,
} from "../../services/employee.service";
import { EducationValidator as validateEducation } from "../../helpers/EducationValidator";
import { DateParser as parse } from "../../helpers/DateParser";
import { DateFormatter as format } from "../../helpers/DateFormatter";
import { EmptyErrorTableChecker as isEmpty } from "../../helpers/EmptyErrorTableChecker";
import { handleSubmit as hS } from "../../helpers/FormSubmition";

//// CSS
import "./Form.scss";

const EditEducationPage = (props) => {
    const id = props.match.params.id;
    const [educationLoaded, setEducationLoaded] = useState(false);
    const [educationsLoaded, setEducationsLoaded] = useState(false);
    const [education, setEducation] = useState({
        label: "",
        name: "",
        requiredHoursNoneCategory: "",
        requiredHours: "",
    });
    const [educations, setEducations] = useState();
    const [eduName, setEduName] = useState("");
    const [fullName, setFullName] = useState("");
    const [eduGraduationDate, setEduGraduationDate] = useState({});
    const [errors, setErrors] = useState({
        education: "",
        eduName: "",
        eduGraduationDate: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const { user: currentUser } = useSelector((state) => state.user);

    const history = useHistory();
    const dispatch = useDispatch();

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

        return isEmpty(tempErrors);
    }, [education, eduName, eduGraduationDate]);

    useEffect(() => {
        const fetchEmployee = () => {
            getEmployeeById(id).then((data) => {
                setFullName(data.fullName);
                setEduGraduationDate(parse(data.eduGraduationDate));
                setEduName(data.eduName || "");
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
                    eduName,
                    eduGraduationDate: format(eduGraduationDate),
                    education: education.name,
                };

                setSubmitting(true);

                hS(
                    id,
                    history,
                    patch,
                    patchEmployeeEducation,
                    "Образование изменено",
                    dispatch
                );
            }
        },
        [id, eduName, eduGraduationDate, education, history, validate, dispatch]
    );

    const onChangeEducation = (e) => {
        const newEducationLabel = e.target.value;
        const newEducation = educations.find(
            (c) => c.label === newEducationLabel
        );
        setEducation(newEducation);
    };

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    if (!educationLoaded || !educationsLoaded) {
        return <Spinner />;
    }

    return (
        <div className="Form">
            <Card className="card">
                <CardContent className="card-content">
                    <div className="card-label">
                        <span className="header-label">
                            Изменить образование
                        </span>
                    </div>

                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input text-field">
                            <MyTextField
                                disabled
                                label="ФИО"
                                value={fullName}
                            />
                        </div>

                        <div className="input text-field">
                            <MyTextField
                                error={errors.education.length > 0}
                                helperText={errors.education}
                                select
                                value={education ? education.label : ""}
                                label="Уровень"
                                onChange={onChangeEducation}
                                onBlur={() => {
                                    if (errors.education.length > 0) validate();
                                }}
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
                                label="Учреждение образования"
                                value={eduName ? eduName : ""}
                                onChange={(e) => setEduName(e.target.value)}
                                onBlur={() => {
                                    if (errors.eduName.length > 0) validate();
                                }}
                            />
                        </div>

                        <div className="input text-field">
                            <MyDatePicker
                                error={errors.eduGraduationDate.length > 0}
                                helperText={errors.eduGraduationDate}
                                label="Дата окончания"
                                value={eduGraduationDate}
                                onChange={(newDate) =>
                                    setEduGraduationDate(newDate)
                                }
                                validate={validate}
                            />
                        </div>

                        <div className="buttons">
                            <FormButtons submitting={submitting} />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditEducationPage;
