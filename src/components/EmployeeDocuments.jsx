import React, { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import OkAlert from "./OkAlert";
import Spinner from "../components/Spinner";
import { Redirect, useLocation, useHistory } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CategoryCard from "./CategoryCard";
import PersonalCard from "./PersonalCard";
import RepresentationForm from "./RepresentationForm";

import {
    getEmployeeById,
    getDocumentForEmployee,
} from "../services/employee.service";

import { getDocumentTypes } from "../services/documentType.service";
import { getPrincipalCompany } from "../services/principal.service";

import "../css/EmployeeDocuments.scss";

const EmployeeDocuments = (props) => {
    const id = props.match.params.id;
    const [employee, setEmployee] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [okAlertShown, setOkAlertShown] = useState(false);
    const [alignment, setAlignment] = useState("representation");
    const [documentTypesLoaded, setDocumentTypesLoaded] = useState(false);
    const [principalCompanyLoaded, setPrincipalCompanyLoaded] = useState(false);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [documentName, setDocumentName] = useState("");
    const [principalCompany, setPrincipalCompany] = useState("");

    const history = useHistory();

    const fetchDocument = () => {
        setLoading(true);
        getDocumentForEmployee(id, {}, alignment)
            .then((data) => {
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setOkAlertShown(true);
            });
    };

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
        const fetchDocumentTypes = () => {
            getDocumentTypes().then((data) => {
                setDocumentTypes(data);
                setAlignment(data[0].name);
                setDocumentName(data[0].label);
                setDocumentTypesLoaded(true);
            });
        };

        fetchDocumentTypes();
    }, []);

    useEffect(() => {
        const fetchPrincipal = () => {
            getPrincipalCompany().then((data) => {
                setPrincipalCompany(data);
                setPrincipalCompanyLoaded(true);
            });
        };

        fetchPrincipal();
    }, []);

    const handleDocumentTypeChange = (event, newAlignment) => {
        console.log(newAlignment);
        setAlignment(newAlignment);

        var documentType = documentTypes.find((type) => {
            return type.name === newAlignment;
        });

        setDocumentName(documentType.label);
    };

    if (isLoading || !documentTypesLoaded || !principalCompanyLoaded) {
        return <Spinner />;
    }

    return (
        <div className="EmployeeDocuments">
            {okAlertShown && (
                <OkAlert
                    message="Отсутствует соединение с сервером..."
                    func={() => {
                        setOkAlertShown(false);
                        history.push("/employees");
                    }}
                />
            )}
            <div className="cards-row">
                <PersonalCard employee={employee} showCardActions={false} />
                <CategoryCard employee={employee} showCardActions={false} />
            </div>
            <div className="type-btns">
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleDocumentTypeChange}
                >
                    {documentTypes &&
                        documentTypes.map((type) => {
                            return (
                                <ToggleButton
                                    key={type.name}
                                    className="type-btn"
                                    value={type.name}
                                >
                                    {type.label}
                                </ToggleButton>
                            );
                        })}
                </ToggleButtonGroup>
            </div>
            <RepresentationForm
                employee={employee}
                principalCompany={principalCompany}
                handleSubmit={fetchDocument}
                documentName={documentName}
            />
            {/* <Button
                variant="outlined"
                style={{
                    fontWeight: "bold",
                }}
                size="large"
                onClick={fetchDocument}
            >
                СКАЧАТЬ
            </Button> */}
        </div>
    );
};

export default EmployeeDocuments;
