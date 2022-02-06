import React, { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Spinner from "../components/Spinner";
import { Redirect, useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import {
    getEmployeeById,
    patchEmployeeActive,
    patchEmployeeExemption,
} from "../services/employee.service";
import { CategoryValidator as validateCategory } from "../helpers/CategoryValidator";
import { EducationValidator as validateEducation } from "../helpers/EducationValidator";
import { DateParser as parse } from "../helpers/DateParser";
import CoursesTable from "./CoursesTable";
import MyAlert from "./MyAlert";
import OkAlert from "./OkAlert";
import { banana_color, green, red, sky_blue, pink } from "../helpers/color";

import "../css/EmployeeView.scss";
import "../css/DarkMode.scss";

const EmployeeView = (props) => {
    const id = props.match.params.id;
    const [clickCounter, setClickCounter] = useState(0);
    const [employee, setEmployee] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [shownEducation, setShownEducation] = useState(false);
    const [shownExemption, setShownExemption] = useState(false);
    const [categoryIsValid, setCategoryIsValid] = useState(false);
    const [educationIsValid, setEducationIsValid] = useState(false);
    const { user: currentUser } = useSelector((state) => state.auth);
    const [toggleActiveAlertShown, setToggleActiveAlertShown] = useState(false);
    const [okAlertShown, setOkAlertShown] = useState(false);
    const [snackOpened, setSnackOpened] = useState(false);

    const location = useLocation();

    const [snackMessage, setSnackMessage] = useState(
        location.state ? location.state.snackMessage : ""
    );

    const history = useHistory();

    useEffect(() => {
        setSnackMessage(location.state ? location.state.snackMessage : "");
        setSnackOpened(location.state && location.state.snackMessage !== "");
    }, [location]);

    const validateCat = useCallback(() => {
        const tempErrors = validateCategory(
            employee.qualification,
            employee.category,
            employee.categoryNumber,
            parse(employee.categoryAssignmentDate)
        );

        setCategoryIsValid(
            Object.values(tempErrors).every((item) => item === "")
        );
    }, [employee]);

    const validateEdu = useCallback(() => {
        const tempErrors = validateEducation(
            employee.education,
            employee.eduName,
            parse(employee.eduGraduationDate)
        );

        setEducationIsValid(
            Object.values(tempErrors).every((item) => item === "")
        );
    }, [employee]);

    const fetchData = useCallback(() => {
        getEmployeeById(id)
            .then((data) => {
                setEmployee(data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setOkAlertShown(true);
            });
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        validateCat();
    }, [validateCat]);

    useEffect(() => {
        validateEdu();
    }, [validateEdu]);

    const toggleActiveAlert = () => {
        setToggleActiveAlertShown(!toggleActiveAlertShown);
    };

    const handleToggleEmployeeStateSubmit = useCallback(
        (e) => {
            e.preventDefault();

            const patch = {
                active: !employee.active,
            };

            patchEmployeeActive(id, patch).then(() => {
                history.replace({
                    state: { snackMessage: "Stan został zmieniony" },
                });
                window.location.reload();
            });
        },
        [id, employee.active, history]
    );

    const deleteExemption = useCallback(() => {
        const patch = {
            exemption: null,
            exemptionStartDate: null,
            exemptionEndDate: null,
        };

        patchEmployeeExemption(id, patch).then(() => {
            history.replace({
                state: { snackMessage: "Zwolnienie zostało usunięte" },
            });
            window.location.reload();
        });
    }, [id, history]);

    const handleSnackClose = () => {
        setSnackOpened(false);
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return (
        <div>
            {toggleActiveAlertShown && (
                <MyAlert
                    question={`Вы уверенны, что хотите изменить состояние сотрудника ${
                        employee.fullName
                    } на ${!employee.active ? "'Активный'" : "'Неактивный'"} ?`}
                    cancelFunc={toggleActiveAlert}
                    submitFunc={handleToggleEmployeeStateSubmit}
                />
            )}
            {okAlertShown && (
                <OkAlert
                    message="Отсутствует соединение с сервером..."
                    func={() => {
                        setOkAlertShown(false);
                        history.push("/employees");
                    }}
                />
            )}
            <div
                className={
                    toggleActiveAlertShown || okAlertShown ? "dark-mode" : ""
                }
            >
                <div className="EmployeeView">
                    <Snackbar
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        open={snackOpened}
                        autoHideDuration={10000}
                        onClose={handleSnackClose}
                    >
                        <Alert
                            onClose={handleSnackClose}
                            severity="success"
                            sx={{ width: "100%" }}
                        >
                            {snackMessage}
                        </Alert>
                    </Snackbar>
                    <div className="first-row">
                        <Card className="card main-info">
                            <CardContent
                                className="card-content"
                                style={{
                                    backgroundColor: banana_color,
                                }}
                            >
                                <div className="card-label">
                                    <span className="header-label">
                                        Персональные данные
                                    </span>
                                    <Tooltip
                                        title="Нажмите, чтобы изменить состояние сотрудника"
                                        placement="top"
                                    >
                                        <span
                                            className="pin"
                                            style={
                                                employee.active
                                                    ? {
                                                          backgroundColor:
                                                              green,
                                                      }
                                                    : {
                                                          backgroundColor: red,
                                                      }
                                            }
                                            onClick={toggleActiveAlert}
                                        >
                                            {employee.active
                                                ? "Активный"
                                                : "Неактивный"}
                                        </span>
                                    </Tooltip>
                                </div>
                                <div>
                                    <span className="label-text">ФИО:</span>
                                    <span className="value-text">
                                        {employee.fullName}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text">
                                        Дата приема на работу:
                                    </span>
                                    <span className="value-text">
                                        {employee.hiringDate}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text">
                                        Место работы:
                                    </span>
                                    <span className="value-text">
                                        {employee.jobFacility}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text">
                                        Должность:
                                    </span>
                                    <span className="value-text">
                                        {employee.position}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="card">
                            <CardContent
                                className="card-content"
                                style={{
                                    backgroundColor: banana_color,
                                }}
                            >
                                <div className="card-label">
                                    <span className="header-label">
                                        Категория
                                    </span>
                                    <span
                                        className="pin"
                                        style={
                                            !employee.category
                                                ? {
                                                      backgroundColor: red,
                                                  }
                                                : {
                                                      backgroundColor: green,
                                                  }
                                        }
                                    >
                                        {!employee.category
                                            ? "Необходимо указать"
                                            : employee.category.label}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Квалификация:
                                    </span>
                                    <span className="value-text">
                                        {employee.qualification}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Категория:
                                    </span>
                                    <span className="value-text">
                                        {employee
                                            ? employee.category
                                                ? employee.category.label
                                                : ""
                                            : ""}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Номер:
                                    </span>
                                    <span className="value-text">
                                        {employee.categoryNumber}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Дата получения:
                                    </span>
                                    <span className="value-text">
                                        {employee.categoryAssignmentDate}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Срок подтверждения:
                                    </span>
                                    <span className="value-text">
                                        {
                                            employee.categoryAssignmentDeadlineDate
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Срок подачи документов:
                                    </span>
                                    <span className="value-text">
                                        {employee.docsSubmitDeadlineDate}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Возможное повышение категории после:
                                    </span>
                                    <span className="value-text">
                                        {employee.categoryPossiblePromotionDate}
                                    </span>
                                </div>
                                <CardActions className="card-actions">
                                    <Tooltip
                                        title={
                                            employee.exemptioned
                                                ? "Сотрудник освобождён"
                                                : !educationIsValid
                                                ? "Необходимо указать образование"
                                                : ""
                                        }
                                        placement="right"
                                    >
                                        <div>
                                            <Button
                                                disabled={
                                                    !educationIsValid ||
                                                    employee.exemptioned
                                                }
                                                variant="outlined"
                                                style={{
                                                    fontWeight: "bold",
                                                }}
                                                size="large"
                                                onClick={() => {
                                                    history.push(
                                                        `/employees/${employee.id}/edit-category`
                                                    );
                                                }}
                                            >
                                                {categoryIsValid
                                                    ? "Изменить"
                                                    : "Указать"}
                                            </Button>
                                        </div>
                                    </Tooltip>
                                    {categoryIsValid && (
                                        <Tooltip
                                            title={
                                                clickCounter < 2 &&
                                                !employee.exemptioned
                                                    ? "Нажмите 2 раза, чтобы вручную указать срок подтверждения категории"
                                                    : ""
                                            }
                                            placement="right"
                                        >
                                            <div
                                                onClick={() => {
                                                    setClickCounter(
                                                        clickCounter + 1
                                                    );
                                                }}
                                            >
                                                <Button
                                                    disabled={
                                                        clickCounter < 1 ||
                                                        employee.exemptioned
                                                    }
                                                    variant="outlined"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                    size="large"
                                                    onClick={() => {
                                                        history.push(
                                                            `/employees/${employee.id}/edit-category-deadline`
                                                        );
                                                    }}
                                                >
                                                    Указать вручную
                                                </Button>
                                            </div>
                                        </Tooltip>
                                    )}
                                </CardActions>
                            </CardContent>
                        </Card>
                        <Card className="card">
                            <CardContent
                                className="card-content"
                                style={{
                                    backgroundColor: pink,
                                }}
                            >
                                <div className="course-hours">
                                    <span>
                                        {employee.courseHoursLeft == null
                                            ? "-"
                                            : employee.courseHoursLeft}
                                    </span>
                                </div>
                                <div className="course-label">
                                    <span>Необходимый объем часов</span>
                                </div>
                                <div className="course-date-label">
                                    <span>
                                        {employee.categoryAssignmentDeadlineDate
                                            ? "до " +
                                              employee.categoryAssignmentDeadlineDate
                                            : ""}
                                    </span>
                                </div>
                                <div className="add-course-btn">
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        style={{
                                            backgroundColor: sky_blue,
                                            color: "black",
                                            fontWeight: "bold",
                                            height: "50px",
                                            width: "200px",
                                        }}
                                        onClick={() => {
                                            history.push({
                                                pathname: `/employees/${id}/add-course`,
                                                state: {
                                                    employeeFullName:
                                                        employee.fullName,
                                                },
                                            });
                                        }}
                                    >
                                        Добавить курс
                                    </Button>
                                </div>
                                {/* </Tooltip>
                        </div> */}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="second-row">
                        <Tooltip
                            title={
                                shownEducation
                                    ? ""
                                    : "Нажмите, чтобы развернуть"
                            }
                            followCursor
                        >
                            <Card
                                className="card"
                                onClick={() =>
                                    setShownEducation(!shownEducation)
                                }
                            >
                                <CardContent
                                    className="card-content"
                                    style={{
                                        backgroundColor: banana_color,
                                    }}
                                >
                                    <div className="card-label">
                                        <span className="header-label">
                                            Образование
                                        </span>
                                        <span
                                            className="pin"
                                            style={
                                                !employee.education
                                                    ? {
                                                          backgroundColor: red,
                                                      }
                                                    : {
                                                          backgroundColor:
                                                              green,
                                                      }
                                            }
                                        >
                                            {!employee.education
                                                ? "Необходимо указать"
                                                : employee.education.label}
                                        </span>
                                    </div>
                                    <Collapse in={shownEducation} timeout={500}>
                                        <div className="info-row">
                                            <span className="label-text">
                                                Уровень:
                                            </span>
                                            <span className="value-text">
                                                {employee
                                                    ? employee.education
                                                        ? employee.education
                                                              .label
                                                        : ""
                                                    : ""}
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label-text">
                                                УЗ:
                                            </span>
                                            <span className="value-text">
                                                {employee.eduName}
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label-text">
                                                Дата окончания:
                                            </span>
                                            <span className="value-text">
                                                {employee.eduGraduationDate}
                                            </span>
                                        </div>
                                        <CardActions className="card-actions">
                                            <Button
                                                variant="outlined"
                                                style={{
                                                    fontWeight: "bold",
                                                }}
                                                size="large"
                                                onClick={() => {
                                                    history.push(
                                                        `/employees/${employee.id}/edit-edu`
                                                    );
                                                }}
                                            >
                                                {educationIsValid
                                                    ? "Изменить"
                                                    : "Указать"}
                                            </Button>
                                        </CardActions>
                                    </Collapse>
                                </CardContent>
                            </Card>
                        </Tooltip>
                        <Tooltip
                            title={
                                shownExemption
                                    ? ""
                                    : "Нажмите, чтобы развернуть"
                            }
                            followCursor
                        >
                            <Card
                                className="card"
                                onClick={() =>
                                    setShownExemption(!shownExemption)
                                }
                            >
                                <CardContent
                                    className="card-content"
                                    style={{
                                        backgroundColor: banana_color,
                                    }}
                                >
                                    <div className="card-label">
                                        <span className="header-label">
                                            Освобождение
                                        </span>
                                        <span
                                            className="pin"
                                            style={
                                                employee.exemptioned
                                                    ? {
                                                          backgroundColor: red,
                                                      }
                                                    : {
                                                          backgroundColor:
                                                              green,
                                                      }
                                            }
                                        >
                                            {employee.exemptioned
                                                ? "Освобождён"
                                                : "Нет"}
                                        </span>
                                    </div>
                                    <Collapse in={shownExemption} timeout={500}>
                                        {employee.exemption && (
                                            <div>
                                                <div className="info-row">
                                                    <span className="label-text">
                                                        Причина:
                                                    </span>
                                                    <span className="value-text">
                                                        {employee
                                                            ? employee.exemption
                                                                ? employee
                                                                      .exemption
                                                                      .label
                                                                : ""
                                                            : ""}
                                                    </span>
                                                </div>
                                                <div className="info-row">
                                                    <span className="label-text">
                                                        Дата начала:
                                                    </span>
                                                    <span className="value-text">
                                                        {
                                                            employee.exemptionStartDate
                                                        }
                                                    </span>
                                                </div>
                                                <div className="info-row">
                                                    <span className="label-text">
                                                        Дата окончания:
                                                    </span>
                                                    <span className="value-text">
                                                        {
                                                            employee.exemptionEndDate
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <CardActions className="card-actions">
                                            <Tooltip
                                                title={
                                                    !categoryIsValid
                                                        ? "Необходимо указать категорию"
                                                        : ""
                                                }
                                                placement="right"
                                            >
                                                <div>
                                                    <Button
                                                        disabled={
                                                            !categoryIsValid
                                                        }
                                                        variant="outlined"
                                                        style={{
                                                            fontWeight: "bold",
                                                        }}
                                                        size="large"
                                                        onClick={() => {
                                                            history.push(
                                                                `${id}/edit-exemption`
                                                            );
                                                        }}
                                                    >
                                                        {employee.exemptioned
                                                            ? "Изменить"
                                                            : "Указать"}
                                                    </Button>
                                                </div>
                                            </Tooltip>
                                            {employee.exemptioned && (
                                                <Button
                                                    variant="outlined"
                                                    style={{
                                                        fontWeight: "bold",
                                                        marginLeft: "8px",
                                                    }}
                                                    size="large"
                                                    onClick={deleteExemption}
                                                >
                                                    Удалить
                                                </Button>
                                            )}
                                        </CardActions>
                                    </Collapse>
                                </CardContent>
                            </Card>
                        </Tooltip>
                    </div>
                    <CoursesTable employeeId={id} />
                </div>
            </div>
        </div>
    );
};

export default EmployeeView;
