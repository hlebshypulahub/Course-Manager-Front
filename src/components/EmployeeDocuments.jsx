//// React
import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";

//// Components
import MyModal from "./MyModal";
import Spinner from "../components/Spinner";
import CategoryCard from "./CategoryCard";
import PersonalCard from "./PersonalCard";
import RepresentationForm from "./RepresentationForm";
import QualificationSheetForm from "./QualificationSheetForm";
import ProfessionalReportForm from "./ProfessionalReportForm";

//// Mui
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

//// Functions
import { getEmployeeById } from "../services/employee.service";
import { getCategories } from "../services/category.service";
import { getDocumentForEmployee } from "../services/employee.service";
import { getDocumentTypes } from "../services/documentType.service";
import { getPrincipalCompany } from "../services/principal.service";

//// CSS
import "../css/EmployeeDocuments.scss";

const EmployeeDocuments = (props) => {
    const id = props.match.params.id;
    const [employee, setEmployee] = useState();
    const [isLoading, setLoading] = useState(false);
    const [modalShown, setModalShown] = useState(false);
    const [alignment, setAlignment] = useState("REPRESENTATION");
    const [documentTypesLoaded, setDocumentTypesLoaded] = useState(false);
    const [principalCompanyLoaded, setPrincipalCompanyLoaded] = useState(false);
    const [documentTypes, setDocumentTypes] = useState();
    const [principalCompany, setPrincipalCompany] = useState("");
    const [categories, setCategories] = useState();
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);

    const history = useHistory();

    const fetchDocument = useCallback(
        (e, documentDto, documentType) => {
            e.preventDefault();
            getDocumentForEmployee(id, documentDto, documentType).catch(() => {
                setModalShown(true);
            });
        },
        [id]
    );

    useEffect(() => {
        const fetchCategories = () => {
            getCategories()
                .then((data) => {
                    setCategories(data.filter((c) => c.name !== "NONE"));
                    setCategoriesLoaded(true);
                })
                .catch(() => {
                    setModalShown(true);
                });
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchEmployee = () => {
            getEmployeeById(id)
                .then((data) => {
                    setEmployee(data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setModalShown(true);
                });
        };

        setLoading(true);
        fetchEmployee();
    }, [id]);

    useEffect(() => {
        const fetchDocumentTypes = () => {
            getDocumentTypes().then((data) => {
                setDocumentTypes(data);
                setAlignment(data[0].name);
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
        if (!newAlignment) {
            return;
        }

        setAlignment(newAlignment);
    };

    if (modalShown) {
        return (
            <MyModal
                message="Отсутствует соединение с сервером..."
                func={() => {
                    history.push("/employees");
                }}
            />
        );
    }

    if (
        isLoading ||
        !documentTypesLoaded ||
        !principalCompanyLoaded ||
        !categoriesLoaded
    ) {
        return <Spinner />;
    }

    return (
        <div className="EmployeeDocuments">
            {modalShown && (
                <MyModal
                    message="Отсутствует соединение с сервером..."
                    func={() => {
                        setModalShown(false);
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
            {alignment === "REPRESENTATION" && (
                <RepresentationForm
                    employee={employee}
                    principalCompany={principalCompany}
                    categories={categories}
                    fetchDocument={fetchDocument}
                />
            )}
            {alignment === "QUALIFICATION_SHEET" && (
                <QualificationSheetForm
                    employee={employee}
                    principalCompany={principalCompany}
                    categories={categories}
                    fetchDocument={fetchDocument}
                />
            )}
            {alignment === "PROFESSIONAL_REPORT" && (
                <ProfessionalReportForm
                    employee={employee}
                    principalCompany={principalCompany}
                    fetchDocument={fetchDocument}
                />
            )}
        </div>
    );
};

export default EmployeeDocuments;
