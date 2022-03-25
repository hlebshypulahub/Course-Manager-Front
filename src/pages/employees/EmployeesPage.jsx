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

//// Functions
import {
    getEmployees,
    getEmployeesByGroups,
    getEmployeesForCoursePlan,
} from "../../services/employee.service";
import ArticleIcon from "@mui/icons-material/Article";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { uploadFile } from "../../services/file.service";
import { setError } from "../../redux";
import { legend } from "../../components/tables/TableColumns";

//// Utils
import { green, sky_blue, pink, grey } from "../../helpers/color";

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

    const fetchEmployeesForCoursePlan = () => {
        setLoading(true);

        const fetchEmployees = () => {
            getEmployeesForCoursePlan()
                .then((data) => {
                    setEmployees(data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    dispatch(
                        setError("Отсутствует соединение с сервером...", true)
                    );
                });
        };

        fetchEmployees();
    };

    const showFilteredEmployees = useCallback(
        (groupName) => {
            setEmployees(
                employees.filter((e) => {
                    return e.colorGroup.some((c) => c === groupName);
                })
            );
        },
        [employees]
    );

    const goToEmployeeView = useCallback(() => {
        history.push("/employees/" + employeeId);
    }, [employeeId, history]);

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    if (isEmployeesByGroupsLoading || isLoading) {
        return <Spinner />;
    }

    employees.forEach((e) => (e.colorGroup = []));

    const legendNames = legend.map((l) => l.name);
    legendNames.forEach((g) => {
        employeesByGroups[g].forEach((e) => {
            employees.forEach((employee) => {
                if (employee.id === e.id) {
                    employee.colorGroup.push(g);
                }
            });
        });
    });

    return (
        <div>
            <div className="EmployeesPage">
                <div className="top-btns">
                    <Button
                        variant="contained"
                        component="span"
                        endIcon={<ArticleIcon />}
                        style={{
                            backgroundColor: pink,
                            color: "white",
                            fontWeight: "600",
                            height: "40px",
                            width: "200px",
                        }}
                        onClick={fetchEmployeesForCoursePlan}
                    >
                        План аттестации
                    </Button>

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
