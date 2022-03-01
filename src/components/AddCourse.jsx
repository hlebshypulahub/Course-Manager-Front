//// React
import React, { useState, useCallback } from "react";
import validator from "validator";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

//// Components
import MyTextField from "./MyTextField";
import MyDatePicker from "./MyDatePicker";
import FormButtons from "./FormButtons";

//// Mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//// Functions
import { addCourseToEmployee } from "../services/course.service";
import { DateFormatter as format } from "../helpers/DateFormatter";

//// Utils
import { banana_color } from "../helpers/color";

//// CSS
import "../css/Form.scss";

const AddCourse = ({props}) => {
    const employeeFullName = props.location.state.employeeFullName;
    const employeeId = props.match.params.id;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [hours, setHours] = useState("");
    const [startDate, setStartDate] = useState({});
    const [endDate, setEndDate] = useState({});
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        hours: "",
        startDate: "",
        endDate: "",
    });

    const { user: currentUser } = useSelector((state) => state.auth);

    const history = useHistory();

    const validate = useCallback(() => {
        let tempErrors = {};
        tempErrors.name = name ? "" : "Необходимо указать название курса";
        tempErrors.description = "";
        tempErrors.hours =
            Number.isInteger(Number(hours)) && Number(hours) > 0
                ? ""
                : "Необходимо указать количество часов";
        tempErrors.startDate = validator.isDate(startDate)
            ? ""
            : "Необходимо указать дату начала";
        tempErrors.endDate = validator.isDate(endDate)
            ? ""
            : "Необходимо указать дату окончания";

        if (endDate < startDate) {
            tempErrors.endDate =
                "Дата окончания должна быть позднее даты начала";
        }

        setErrors(tempErrors);

        return Object.values(tempErrors).every((item) => item === "");
    }, [name, hours, startDate, endDate]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (validate()) {
                const course = {
                    ...(name && { name }),
                    ...(description && { description }),
                    ...(hours && { hours }),
                    ...(startDate && { startDate: format(startDate) }),
                    ...(endDate && { endDate: format(endDate) }),
                };

                addCourseToEmployee(employeeId, course).then(() => {
                    history.push({
                        pathname: `/employees/${employeeId}`,
                        state: {
                            snackMessage: `Курс добавлен`,
                        },
                    });
                });
            }
        },
        [
            employeeId,
            name,
            description,
            hours,
            startDate,
            endDate,
            history,
            validate,
        ]
    );

    const onChangeName = (e) => {
        const newName = e.target.value;
        setName(newName);
    };

    const onChangeDescription = (e) => {
        const newDescription = e.target.value;
        setDescription(newDescription);
    };

    const onChangeHours = (e) => {
        const newHours = e.target.value;
        setHours(newHours);
    };

    const onChangeStartDate = (newStartDate) => {
        if (!newStartDate) {
            setErrors({
                ...errors,
                startDate: "Необходимо указать дату начала",
            });
        }
        setStartDate(newStartDate);
    };

    const onChangeEndDate = (newEndDate) => {
        if (!newEndDate) {
            setErrors({
                ...errors,
                endDate: "Необходимо указать дату окончания",
            });
        }
        setEndDate(newEndDate);
    };

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
                        <span className="header-label">Добавить курс</span>
                    </div>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input text-field">
                            <MyTextField
                                disabled
                                label="ФИО"
                                value={employeeFullName ? employeeFullName : ""}
                            />
                        </div>
                        <div className="input text-field">
                            <MyTextField
                                error={errors.name.length > 0}
                                helperText={errors.name}
                                label="Название"
                                value={name}
                                onChange={onChangeName}
                            />
                        </div>
                        <div className="input text-field">
                            <MyTextField
                                error={errors.description.length > 0}
                                helperText={errors.description}
                                label="Описание"
                                value={description}
                                onChange={onChangeDescription}
                            />
                        </div>
                        <div className="input text-field">
                            <MyTextField
                                error={errors.hours.length > 0}
                                helperText={errors.hours}
                                pattern="[0-9]*"
                                label="Количество часов"
                                value={hours}
                                onChange={onChangeHours}
                            />
                        </div>
                        <div className="input text-field">
                            <MyDatePicker
                                error={errors.startDate.length > 0}
                                helperText={errors.startDate}
                                label="Дата начала"
                                value={startDate}
                                onChange={onChangeStartDate}
                            />
                        </div>
                        <div className="input text-field">
                            <MyDatePicker
                                error={errors.endDate.length > 0}
                                helperText={errors.endDate}
                                label="Дата окончания"
                                value={endDate}
                                onChange={onChangeEndDate}
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

export default AddCourse;
