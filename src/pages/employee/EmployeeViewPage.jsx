//// React
import React, { useState, useEffect, useCallback } from "react";
import { Redirect, useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

//// Components
import Spinner from "../../components/spinner/Spinner";
import CoursesTable from "../../components/tables/CoursesTable";
import CategoryCard from "../../components/cards/CategoryCard";
import PersonalCard from "../../components/cards/PersonalCard";
import MyModal from "../../components/modals/MyModal";
import SnackBar from "../../components/SnackBar";
import CoursesInfoCard from "../../components/cards/CoursesInfoCard";
import EducationCard from "../../components/cards/EducationCard";
import MyAcceptModal from "../../components/modals/MyAcceptModal";
import ExemptionCard from "../../components/cards/ExemptionCard";

//// Functions
import {
    getEmployeeById,
    patchEmployeeActive,
    patchEmployeeExemption,
} from "../../services/employee.service";
import { CategoryValidator as validateCategory } from "../../helpers/CategoryValidator";
import { EducationValidator as validateEducation } from "../../helpers/EducationValidator";
import { DateParser as parse } from "../../helpers/DateParser";
import { EmptyErrorTableChecker as isEmpty } from "../../helpers/EmptyErrorTableChecker";
import { getEmployeeCourses } from "../../services/course.service";

//// CSS
import "./EmployeeView.scss";

const EmployeeViewPage = (props) => {
    const id = props.match.params.id;
    const [employee, setEmployee] = useState();
    const [isLoading, setLoading] = useState(true);
    const [categoryIsValid, setCategoryIsValid] = useState(false);
    const [educationIsValid, setEducationIsValid] = useState(false);
    const [employeeStateModalShown, setEmployeeStateModalShown] =
        useState(false);
    const [errorModalShown, setErrorModalShown] = useState(false);
    const [snackOpened, setSnackOpened] = useState(false);
    const [courses, setCourses] = useState();
    const [isCoursesLoading, setCoursesLoading] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);

    const location = useLocation();
    const history = useHistory();

    //////// ????
    const [snackMessage, setSnackMessage] = useState(
        location.state ? location.state.snackMessage : ""
    );

    useEffect(() => {
        const fetchCourses = () => {
            getEmployeeCourses(id).then((data) => {
                setCourses(data);
                setCoursesLoading(false);
            });
        };

        setCoursesLoading(true);
        fetchCourses();
    }, [id]);

    useEffect(() => {
        setSnackMessage(location.state ? location.state.snackMessage : "");
        setSnackOpened(Boolean(location.state && location.state.snackMessage));
    }, [location]);

    useEffect(() => {
        if (employee) {
            const tempErrors = validateCategory(
                employee.qualification,
                employee.category,
                employee.categoryNumber,
                parse(employee.categoryAssignmentDate)
            );

            setCategoryIsValid(isEmpty(tempErrors));
        }
    }, [employee]);

    useEffect(() => {
        if (employee) {
            const tempErrors = validateEducation(
                employee.education,
                employee.eduName,
                parse(employee.eduGraduationDate)
            );

            setEducationIsValid(isEmpty(tempErrors));
        }
    }, [employee]);

    useEffect(() => {
        const fetchEmployee = () => {
            getEmployeeById(id)
                .then((data) => {
                    setEmployee(data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setErrorModalShown(true);
                });
        };

        fetchEmployee();
    }, [id]);

    const toggleEmployeeStateModalShown = () => {
        setEmployeeStateModalShown(!employeeStateModalShown);
    };

    const handleToggleEmployeeStateSubmit = useCallback(
        (e) => {
            e.preventDefault();

            const patch = {
                active: !employee.active,
            };

            patchEmployeeActive(id, patch).then(() => {
                history.replace({
                    state: { snackMessage: "Состояние изменено" },
                });
                window.location.reload();
            });
        },
        [id, employee, history]
    );

    const deleteExemption = useCallback(() => {
        const patch = {
            exemption: null,
            exemptionStartDate: null,
            exemptionEndDate: null,
        };

        patchEmployeeExemption(id, patch).then(() => {
            history.replace({
                state: { snackMessage: "Освобождение удалено" },
            });
            window.location.reload();
        });
    }, [id, history]);

    const handleSnackClose = () => {
        setSnackOpened(false);
        setSnackMessage("");
    };

    useEffect(() => {
        return () => {
            history.replace({
                state: { snackMessage: "" },
            });
        };
    }, [history]);

    if (isLoading) {
        return <Spinner />;
    }

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    const employeeStateModal = employeeStateModalShown && (
        <MyAcceptModal
            message={`Вы уверенны, что хотите изменить состояние сотрудника ${
                employee.fullName
            } на ${!employee.active ? "'Активный'" : "'Неактивный'"} ?`}
            submitFunc={handleToggleEmployeeStateSubmit}
            cancelFunc={toggleEmployeeStateModalShown}
        />
    );

    const errorModal = errorModalShown && (
        <MyModal
            message="Отсутствует соединение с сервером..."
            func={() => {
                setErrorModalShown(false);
            }}
        />
    );

    const snackBar = (
        <SnackBar
            open={snackOpened}
            message={snackMessage}
            handleClose={handleSnackClose}
        />
    );

    return (
        <div>
            {employeeStateModal}

            {errorModal}

            {snackBar}

            <div className="EmployeeView">
                <div className="first-row">
                    <PersonalCard
                        withActions
                        employee={employee}
                        toggleEmployeeStateModalShown={
                            toggleEmployeeStateModalShown
                        }
                        showCardActions={true}
                        categoryIsValid={categoryIsValid}
                    />

                    <CategoryCard
                        employee={employee}
                        categoryIsValid={categoryIsValid}
                        educationIsValid={educationIsValid}
                        showCardActions={true}
                    />

                    <CoursesInfoCard employee={employee} />
                </div>

                <div className="second-row">
                    <EducationCard
                        employee={employee}
                        educationIsValid={educationIsValid}
                    />

                    <ExemptionCard
                        employee={employee}
                        deleteExemption={deleteExemption}
                        categoryIsValid={categoryIsValid}
                    />
                </div>

                <CoursesTable
                    courses={courses}
                    isCoursesLoading={isCoursesLoading}
                />
            </div>
        </div>
    );
};

export default EmployeeViewPage;