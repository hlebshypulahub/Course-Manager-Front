//// React
import { useState, useEffect, useCallback } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//// Components
import Spinner from "../../components/spinner/Spinner";
import CoursesTable from "../../components/tables/CoursesTable";
import CategoryCard from "../../components/cards/CategoryCard";
import PersonalCard from "../../components/cards/PersonalCard";
import CoursesInfoCard from "../../components/cards/CoursesInfoCard";
import EducationCard from "../../components/cards/EducationCard";
import MyAcceptModal from "../../components/modals/MyAcceptModal";
import ExemptionCard from "../../components/cards/ExemptionCard";

//// Functions
import {
    getEmployeeById,
    patchEmployee,
} from "../../services/employee.service";
import { validateCategory } from "../../helpers/validate-category";
import { validateEducation } from "../../helpers/validate-education";
import { parseDates as parse } from "../../helpers/parse-dates";
import { arrayIsEmpty as isEmpty } from "../../helpers/array-is-empty";
import { getEmployeeCourses } from "../../services/course.service";
import { setMessage, setError } from "../../redux";

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
    const [employeePharmacyModalShown, setEmployeePharmacyModalShown] =
        useState(false);
    const [courses, setCourses] = useState();
    const [isCoursesLoading, setCoursesLoading] = useState(false);
    const [modalSubmitting, setModalSubmitting] = useState(false);
    const [exemptionDeleteSubmitting, setExemptionDeleteSubmitting] =
        useState(false);

    const { user: currentUser } = useSelector((state) => state.user);

    const history = useHistory();
    const dispatch = useDispatch();

    const fetchCourses = useCallback(() => {
        setCoursesLoading(true);

        getEmployeeCourses(id).then((data) => {
            setCourses(data);
            setCoursesLoading(false);
        });
    }, [id]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    useEffect(() => {
        if (employee !== undefined && employee.shortName !== undefined)
            document.title = employee.shortName;
    }, [employee]);

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

    const fetchEmployee = useCallback(() => {
        setLoading(true);

        getEmployeeById(id)
            .then((data) => {
                setEmployee(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                dispatch(
                    setError("Отсутствует соединение с сервером...", true)
                );
            });
    }, [id, dispatch]);

    useEffect(() => fetchEmployee(), [fetchEmployee]);

    const toggleEmployeeStateModalShown = () => {
        setEmployeeStateModalShown(!employeeStateModalShown);
    };

    const handleToggleEmployeeStateSubmit = useCallback(
        (e) => {
            e.preventDefault();

            const patch = {
                type: "active",
                active: !employee.active,
            };

            setModalSubmitting(true);

            patchEmployee(id, patch)
                .then(() => {
                    fetchEmployee();
                    dispatch(setMessage("Состояние изменено"));
                    setModalSubmitting(false);
                    setEmployeeStateModalShown(false);
                })
                .catch(() => {
                    dispatch(
                        setError("Отсутствует соединение с сервером...", true)
                    );
                });
        },
        [id, employee, dispatch, fetchEmployee]
    );

    const toggleEmployeePharmacyModalShown = () => {
        setEmployeePharmacyModalShown(!employeePharmacyModalShown);
    };

    const handleToggleEmployeePharmacySubmit = useCallback(
        (e) => {
            e.preventDefault();

            const patch = {
                type: "pharmacy",
                pharmacy: false,
            };

            setModalSubmitting(true);

            patchEmployee(id, patch)
                .then(() => {
                    dispatch(setMessage("Сотрудник удалён"));
                    history.push(`/employees`);
                })
                .catch(() => {
                    dispatch(
                        setError("Отсутствует соединение с сервером...", true)
                    );
                });
        },
        [id, dispatch, history]
    );

    const deleteExemption = useCallback(() => {
        const patch = {
            type: "exemption",
            exemption: null,
            exemptionStartDate: null,
            exemptionEndDate: null,
        };

        setExemptionDeleteSubmitting(true);

        patchEmployee(id, patch)
            .then(() => {
                dispatch(setMessage("Освобождение удалено"));
                setExemptionDeleteSubmitting(false);
                fetchEmployee();
            })
            .catch(() => {
                dispatch(
                    setError("Отсутствует соединение с сервером...", true)
                );
            });
    }, [id, dispatch, fetchEmployee]);

    useEffect(() => {
        return () => {
            history.replace({
                state: { snackMessage: "" },
            });
        };
    }, [history]);

    const employeeStateModal = employeeStateModalShown && (
        <MyAcceptModal
            submitting={modalSubmitting}
            message={`Вы уверенны, что хотите изменить состояние сотрудника ${
                employee.fullName
            } на ${!employee.active ? "'Активный'" : "'Неактивный'"} ?`}
            submitFunc={handleToggleEmployeeStateSubmit}
            cancelFunc={toggleEmployeeStateModalShown}
        />
    );

    const employeePharmacyModal = employeePharmacyModalShown && (
        <MyAcceptModal
            submitting={modalSubmitting}
            message={`Подтвердите, что сотрудник ${
                employee.fullName
            } не является мед. работником, и его можно удалить из списка учёта!`}
            submitFunc={handleToggleEmployeePharmacySubmit}
            cancelFunc={toggleEmployeePharmacyModalShown}
        />
    );

    if (isLoading) {
        return <Spinner />;
    }

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    return (
        <div>
            {employeeStateModal}
            {employeePharmacyModal}

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
                        withActions
                        employee={employee}
                        toggleEmployeePharmacyModalShown={
                            toggleEmployeePharmacyModalShown
                        }
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
                        deleteSubmitting={exemptionDeleteSubmitting}
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
