//// React
import React, { useState, useEffect, useCallback } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//// Components
import EmployeesTable from "../../components/tables/EmployeesTable";
import Spinner from "../../components/spinner/Spinner";

//// Mui
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import PrintIcon from "@mui/icons-material/Print";
import LoadingButton from "@mui/lab/LoadingButton";

//// Functions
import {
    getEmployees,
    getEmployeesByGroups,
    getCoursePlan,
} from "../../services/employee.service";
import ArticleIcon from "@mui/icons-material/Article";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { uploadFile } from "../../services/file.service";
import { setError } from "../../redux";
import { legend } from "../../components/tables/TableColumns";

//// Utils
import { green, sky_blue, pink, grey, diamond, white, font_grey } from "../../helpers/color";

//// CSS
import "./EmployeesPage.scss";

const EmployeesPage = () => {
    const [employees, setEmployees] = useState();
    const [employeesByGroups, setEmployeesByGroups] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [file, setFile] = useState();
    const [isFilePicked, setFilePicked] = useState(false);
    const [isEmployeesByGroupsLoading, setEmployeesByGroupsLoading] =
        useState(true);
    const [employeeId, setEmployeeId] = useState();
    const [coursePlan, setCoursePlan] = useState(false);
    const [employeesIdsForCoursePlan, setEmployeesIdsForCoursePlan] = useState([
        [],
        [],
    ]);
    const [sendingEmployees, setSendingEmployees] = useState(false);

    const { user: currentUser } = useSelector((state) => state.user);

    const history = useHistory();
    const dispatch = useDispatch();

    const Input = styled("input")({
        display: "none",
    });

    const onChangeFile = (e) => {
        setFile(e.target.files[0]);
        setFilePicked(true);
    };

    const onFileUpload = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("file", file);

        uploadFile(formData)
            .then(() => {
                window.location.reload(true);
            })
            .catch(() => {
                dispatch(
                    setError("Отсутствует соединение с сервером...", true)
                );
            });
    };

    useEffect(() => {
        const fetchEmployees = () => {
            getEmployees()
                .then((data) => {
                    setEmployees(data);
                    setLoading(false);
                })
                .catch(() => {
                    dispatch(
                        setError("Отсутствует соединение с сервером...", true)
                    );
                });
        };

        fetchEmployees();
    }, [dispatch]);

    useEffect(() => {
        const fetchEmployees = () => {
            getEmployeesByGroups()
                .then((data) => {
                    setEmployeesByGroups(data);
                    setEmployeesByGroupsLoading(false);
                })
                .catch(() => {
                    dispatch(
                        setError("Отсутствует соединение с сервером...", true)
                    );
                });
        };

        fetchEmployees();
    }, [dispatch]);

    const showFilteredEmployees = useCallback(
        (groupName) => {
            setEmployees(
                employees.filter((e) => {
                    return e.colorGroup.some((c) => c === groupName);
                })
            );

            setEmployeesIdsForCoursePlan([[], []]);
        },
        [employees]
    );

    useEffect(() => {
        employees && employees.forEach((e) => (e.colorGroup = []));
    }, [employees]);

    useEffect(() => {
        const legendNames = legend.map((l) => l.name);
        if (employees) {
            legendNames.forEach((g) => {
                employeesByGroups[g] &&
                    employeesByGroups[g].forEach((e) => {
                        employees.forEach((employee) => {
                            if (employee.id === e.id) {
                                employee.colorGroup.push(g);
                            }
                        });
                    });
            });
        }
    }, [employees, employeesByGroups]);

    const sendEmployeesIdsForCoursePlan = useCallback(() => {
        setSendingEmployees(true);

        getCoursePlan(employeesIdsForCoursePlan)
            .then(() => setSendingEmployees(false))
            .catch(() => {
                dispatch(
                    setError("Отсутствует соединение с сервером...", true)
                );
            });
    }, [employeesIdsForCoursePlan, dispatch]);

    const onCoursePlanButtonClick = useCallback(() => {
        if (!coursePlan) {
            setCoursePlan(true);
            setEmployees(
                employees.filter(
                    (e) => !e.colorGroup.some((value) => value === "lackOfData")
                )
            );
        } else {
            sendEmployeesIdsForCoursePlan(employeesIdsForCoursePlan);
        }
    }, [
        coursePlan,
        employees,
        sendEmployeesIdsForCoursePlan,
        employeesIdsForCoursePlan,
    ]);

    const goToEmployeeView = useCallback(() => {
        history.push("/employees/" + employeeId);
    }, [employeeId, history]);

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    if (isEmployeesByGroupsLoading || isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <div className="EmployeesPage">
                <div className="top-btns">
                    <LoadingButton
                        loading={sendingEmployees}
                        loadingPosition="end"
                        variant="contained"
                        component="span"
                        endIcon={coursePlan ? <PrintIcon /> : <ArticleIcon />}
                        style={{
                            backgroundColor: coursePlan ? green : white,
                            color: coursePlan ? white : font_grey,
                            fontWeight: "600",
                            height: "40px",
                            width: "200px",
                        }}
                        onClick={() => onCoursePlanButtonClick()}
                    >
                        {coursePlan ? "Печать" : "Создать график"}
                    </LoadingButton>

                    <Button
                        disabled={!employeeId}
                        variant="contained"
                        component="span"
                        endIcon={<PersonSearchIcon />}
                        style={{
                            backgroundColor: !employeeId ? grey : green,
                            color: "white",
                            fontWeight: "600",
                            height: "40px",
                            width: "160px",
                        }}
                        onClick={goToEmployeeView}
                    >
                        Показать
                    </Button>
                </div>

                <EmployeesTable
                    employees={employees}
                    employeesByGroups={employeesByGroups}
                    tableLoading={isEmployeesByGroupsLoading || isLoading}
                    setEmployeeId={(id) => {
                        setEmployeeId(id);
                    }}
                    showFilteredEmployees={showFilteredEmployees}
                    coursePlan={coursePlan}
                    employeesIdsForCoursePlan={employeesIdsForCoursePlan}
                    setEmployeesIdsForCoursePlan={setEmployeesIdsForCoursePlan}
                />

                <div className="upload-btn">
                    {isFilePicked && file ? (
                        <Button
                            variant="contained"
                            component="span"
                            endIcon={<SendIcon />}
                            style={{
                                backgroundColor: green,
                                color: "white",
                                fontWeight: "bold",
                                height: "40px",
                                width: "150px",
                            }}
                            onClick={onFileUpload}
                        >
                            Отправить
                        </Button>
                    ) : (
                        <label htmlFor="contained-button-file">
                            <Input
                                accept=".csv"
                                id="contained-button-file"
                                type="file"
                                onChange={onChangeFile}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<UploadFileIcon />}
                                style={{
                                    fontFamily: "'Roboto', sans-serif",
                                    backgroundColor: sky_blue,
                                    color: "black",
                                    fontWeight: "bold",
                                    height: "40px",
                                    width: "150px",
                                }}
                            >
                                Добавить
                            </Button>
                        </label>
                    )}

                    <span className="value-text">
                        {isFilePicked && file && file.name
                            ? "Выбран файл: " + file.name
                            : "Отправьте файл .csv, импортированный из 1С"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EmployeesPage;
