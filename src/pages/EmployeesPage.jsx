import React, { useState, useEffect } from "react";
import EmployeesTable from "../components/EmployeesTable";
import { Redirect, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import {
    getEmployees,
    getEmployeesForCoursePlan,
} from "../services/employee.service";
import Spinner from "../components/Spinner";
import ArticleIcon from "@mui/icons-material/Article";
import OkAlert from "../components/OkAlert";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

import { uploadFile } from "../services/file.service";

import { green, sky_blue, pink, grey } from "../helpers/color";

import "../css/EmployeesPage.scss";
import "../css/DarkMode.scss";
import { useCallback } from "react";

const EmployeesPage = (props) => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [file, setFile] = useState();
    const [isFilePicked, setFilePicked] = useState(false);
    const { user: currentUser } = useSelector((state) => state.auth);
    const [okAlertShown, setOkAlertShown] = useState(false);
    const [isTableLoading, setTableLoading] = useState(true);
    const [employeeId, setEmployeeId] = useState(0);

    const history = useHistory();

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

        uploadFile(formData).then(() => {
            window.location.reload(true);
        });
    };

    useEffect(() => {
        const fetchEmployees = () => {
            getEmployees()
                .then((data) => {
                    setEmployees(data);
                    setLoading(false);
                    setTableLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    setOkAlertShown(true);
                });
        };

        fetchEmployees();

        return () => {
            setEmployees([]);
        };
    }, []);

    const fetchEmployeesForCoursePlan = () => {
        setLoading(true);
        setTableLoading(true);

        const fetchEmployees = () => {
            getEmployeesForCoursePlan()
                .then((data) => {
                    setEmployees(data);
                    setLoading(false);
                    setTableLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    setOkAlertShown(true);
                });
        };

        fetchEmployees();
    };

    const goToEmployeeView = useCallback(() => {
        history.push("/employees/" + employeeId);
    }, [employeeId, history]);

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            {okAlertShown && (
                <OkAlert
                    message="Brak połączenia z serwerem..."
                    func={() => {
                        setOkAlertShown(false);
                        window.location.reload();
                    }}
                />
            )}
            <div className={okAlertShown ? "dark-mode" : ""}>
                <div className="EmployeesPage">
                    <div className="top-btns">
                        <Button
                            variant="contained"
                            component="span"
                            endIcon={<ArticleIcon />}
                            style={{
                                backgroundColor: pink,
                                color: "white",
                                fontWeight: "bold",
                                height: "40px",
                                width: "200px",
                            }}
                            onClick={fetchEmployeesForCoursePlan}
                        >
                            Zaplanuj kursy
                        </Button>
                        <Button
                            disabled={employeeId < 1}
                            variant="contained"
                            component="span"
                            endIcon={<PersonSearchIcon />}
                            style={{
                                backgroundColor: employeeId < 1 ? grey : green,
                                color: "white",
                                fontWeight: "bold",
                                height: "40px",
                                width: "160px",
                            }}
                            onClick={goToEmployeeView}
                        >
                            Pokaż dane
                        </Button>
                    </div>
                    <EmployeesTable
                        employees={employees}
                        tableLoading={isTableLoading}
                        setEmployeeId={(id) => {
                            setEmployeeId(id);
                        }}
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
                                    width: "120px",
                                }}
                                onClick={onFileUpload}
                            >
                                Wyślij
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
                                        backgroundColor: sky_blue,
                                        color: "black",
                                        fontWeight: "bold",
                                        height: "40px",
                                        width: "120px",
                                    }}
                                >
                                    Dodaj
                                </Button>
                            </label>
                        )}
                        <span className="value-text">
                            {isFilePicked && file && file.name
                                ? "Wybrano plik: " + file.name
                                : "Prześlij plik .csv, pobrany z aplikacji księgowej"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeesPage;
