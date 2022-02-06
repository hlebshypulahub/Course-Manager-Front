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
                    question={`Czy na pewno zmienić stan pracownika ${
                        employee.fullName
                    } na ${!employee.active ? "'Aktywny'" : "'Nieaktywny'"} ?`}
                    cancelFunc={toggleActiveAlert}
                    submitFunc={handleToggleEmployeeStateSubmit}
                />
            )}
            {okAlertShown && (
                <OkAlert
                    message="Brak połączenia z serwerem..."
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
                                        Dane osobowe
                                    </span>
                                    <Tooltip
                                        title="Kliknij, aby zmienić stan"
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
                                                ? "Aktywny"
                                                : "Nieaktywny"}
                                        </span>
                                    </Tooltip>
                                </div>
                                <div>
                                    <span className="label-text">
                                        Imię i nazwisko:
                                    </span>
                                    <span className="value-text">
                                        {employee.fullName}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text">
                                        Data zatrudnienia:
                                    </span>
                                    <span className="value-text">
                                        {employee.hiringDate}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text">
                                        Miejsce pracy:
                                    </span>
                                    <span className="value-text">
                                        {employee.jobFacility}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text">
                                        Stanowisko:
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
                                        Kategoria
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
                                            ? "Należy podać"
                                            : employee.category.label}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Kwalifikacja:
                                    </span>
                                    <span className="value-text">
                                        {employee.qualification}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Kategoria:
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
                                        Numer:
                                    </span>
                                    <span className="value-text">
                                        {employee.categoryNumber}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Data nadania:
                                    </span>
                                    <span className="value-text">
                                        {employee.categoryAssignmentDate}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Termin potwierdzenia:
                                    </span>
                                    <span className="value-text">
                                        {
                                            employee.categoryAssignmentDeadlineDate
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Termin dostarczenia dokumentów:
                                    </span>
                                    <span className="value-text">
                                        {employee.docsSubmitDeadlineDate}
                                    </span>
                                </div>
                                <div>
                                    <span className="label-text-large">
                                        Możliwe nadanie kolejnej kategorii:
                                    </span>
                                    <span className="value-text">
                                        {employee.categoryPossiblePromotionDate}
                                    </span>
                                </div>
                                <CardActions className="card-actions">
                                    <Tooltip
                                        title={
                                            employee.exemptioned
                                                ? "Pracownik jest zwolniony"
                                                : !educationIsValid
                                                ? "Najpierw należy podać wykształcenie"
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
                                                    ? "Edutyj"
                                                    : "Podaj"}
                                            </Button>
                                        </div>
                                    </Tooltip>
                                    {categoryIsValid && (
                                        <Tooltip
                                            title={
                                                clickCounter < 2 &&
                                                !employee.exemptioned
                                                    ? "Kliknij 2 razy, aby ręcznie edytować termin potwierdzenia kategorii"
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
                                                    Edytuj ręcznie
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
                                    <span>Pozostała ilość godzin</span>
                                </div>
                                <div className="course-date-label">
                                    <span>
                                        {employee.categoryAssignmentDeadlineDate
                                            ? "do " +
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
                                        Dodaj kurs
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
                                shownEducation ? "" : "Kliknuj, aby rozwinąć"
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
                                            Wykształcenie
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
                                                ? "Należy podać"
                                                : employee.education.label}
                                        </span>
                                    </div>
                                    <Collapse in={shownEducation} timeout={500}>
                                        <div className="info-row">
                                            <span className="label-text">
                                                Rodzaj:
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
                                                Szkoła:
                                            </span>
                                            <span className="value-text">
                                                {employee.eduName}
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label-text">
                                                Data zakończenia:
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
                                                    ? "Edytuj"
                                                    : "Podaj"}
                                            </Button>
                                        </CardActions>
                                    </Collapse>
                                </CardContent>
                            </Card>
                        </Tooltip>
                        <Tooltip
                            title={
                                shownExemption ? "" : "Kliknuj, aby rozwinąć"
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
                                            Zwolnienie
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
                                                ? "Zwolniony"
                                                : "Brak"}
                                        </span>
                                    </div>
                                    <Collapse in={shownExemption} timeout={500}>
                                        {employee.exemption && (
                                            <div>
                                                <div className="info-row">
                                                    <span className="label-text">
                                                        Przyczyna:
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
                                                        Data początku:
                                                    </span>
                                                    <span className="value-text">
                                                        {
                                                            employee.exemptionStartDate
                                                        }
                                                    </span>
                                                </div>
                                                <div className="info-row">
                                                    <span className="label-text">
                                                        Data zakończenia:
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
                                                        ? "Najpierw należy podać kategorię"
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
                                                            ? "Edytuj"
                                                            : "Podaj"}
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
                                                    Usuń
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
