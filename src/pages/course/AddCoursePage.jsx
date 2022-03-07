//// React
import React, { useState, useEffect, useCallback } from "react";
import validator from "validator";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

//// Components
import MyTextField from "../../components/inputs/MyTextField";
import MyDatePicker from "../../components/inputs/MyDatePicker";
import FormButtons from "../../components/FormButtons";
import Spinner from "../../components/spinner/Spinner";
import MyModal from "../../components/modals/MyModal";

//// Mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//// Functions
import { addCourseToEmployee } from "../../services/course.service";
import { DateFormatter as format } from "../../helpers/DateFormatter";
import { getEmployeeById } from "../../services/employee.service";

//// Utils
import { banana_color } from "../../helpers/color";

//// CSS
import "../edit-pages/Form.scss";

const AddCoursePage = (props) => {
    const [fullName, setFullName] = useState("");
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
    const [employeeLoaded, setEmployeeLoaded] = useState(false);
    const [modalShown, setModalShown] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);

    const history = useHistory();

    useEffect(() => {
        const fetchEmployee = () => {
            getEmployeeById(employeeId).then((data) => {
                setFullName(data.fullName);
                setEmployeeLoaded(true);
            });
        };

        fetchEmployee();
    }, [employeeId]);

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
                    name,
                    description,
                    hours,
                    startDate: format(startDate),
                    endDate: format(endDate),
                };

                addCourseToEmployee(employeeId, course)
                    .then(() => {
                        history.push({
                            pathname: `/employees/${employeeId}`,
                            state: {
                                snackMessage: `Курс добавлен`,
                            },
                        });
                    })
                    .catch(() => {
                        setModalShown(true);
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

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    if (!employeeLoaded) {
        return <Spinner />;
    }

        const modal = modalShown && (
            <MyModal
                message="Отсутствует соединение с сервером..."
                func={() => {
                    setModalShown(false);
                }}
            />
        );

    return (
        <div className="Form">
            {modal}

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
                                value={fullName}
                            />
                        </div>

                        <div className="input text-field">
                            <MyTextField
                                error={errors.name.length > 0}
                                helperText={errors.name}
                                label="Название"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="input text-field">
                            <MyTextField
                                error={errors.description.length > 0}
                                helperText={errors.description}
                                label="Описание"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="input text-field">
                            <MyTextField
                                error={errors.hours.length > 0}
                                helperText={errors.hours}
                                type="number"
                                label="Количество часов"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                            />
                        </div>

                        <div className="input text-field">
                            <MyDatePicker
                                error={errors.startDate.length > 0}
                                helperText={errors.startDate}
                                label="Дата начала"
                                value={startDate}
                                onChange={(newDate) => setStartDate(newDate)}
                            />
                        </div>

                        <div className="input text-field">
                            <MyDatePicker
                                error={errors.endDate.length > 0}
                                helperText={errors.endDate}
                                label="Дата окончания"
                                value={endDate}
                                onChange={(newDate) => setEndDate(newDate)}
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

export default AddCoursePage;
