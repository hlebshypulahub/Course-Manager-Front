//// React
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

//// Components
import Spinner from "../../components/spinner/Spinner";
import CategoryCard from "../../components/cards/CategoryCard";
import PersonalCard from "../../components/cards/PersonalCard";
import RepresentationForm from "../../components/documents/RepresentationForm";
import QualificationSheetForm from "../../components/documents/QualificationSheetForm";
import ProfessionalReportForm from "../../components/documents/ProfessionalReportForm";

//// Mui
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

//// Functions
import { getEmployeeById } from "../../services/employee.service";
import { getCategories } from "../../services/category.service";
import { getDocumentForEmployee } from "../../services/employee.service";
import { getDocumentTypes } from "../../services/document-type.service";
import { setError } from "../../redux";

//// CSS
import "./EmployeeDocuments.scss";

const EmployeeDocumentsPage = (props) => {
    const id = props.match.params.id;
    const [employee, setEmployee] = useState();
    const [isLoading, setLoading] = useState(false);
    const [alignment, setAlignment] = useState("REPRESENTATION");
    const [documentTypesLoaded, setDocumentTypesLoaded] = useState(false);
    const [documentTypes, setDocumentTypes] = useState();
    const principalCompany = JSON.parse(localStorage.getItem("user")).company;
    const [categories, setCategories] = useState();
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    const [fetchingDocument, setFetchingDocument] = useState(false);

    const { user: currentUser } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    useEffect(() => (document.title = "Документы сотрудника"), []);

    const fetchDocument = useCallback(
        (e, documentDto, documentType) => {
            e.preventDefault();

            setFetchingDocument(true);

            getDocumentForEmployee(id, documentDto, documentType)
                .then(() => setFetchingDocument(false))
                .catch(() => {
                    dispatch(
                        setError("Отсутствует соединение с сервером...", true)
                    );
                });
        },
        [id, dispatch]
    );

    useEffect(() => {
        const fetchCategories = () => {
            getCategories()
                .then((data) => {
                    setCategories(data.filter((c) => c.name !== "NONE"));
                    setCategoriesLoaded(true);
                })
                .catch(() => {
                    dispatch(
                        setError("Отсутствует соединение с сервером...", true)
                    );
                });
        };

        fetchCategories();
    }, [dispatch]);

    useEffect(() => {
        const fetchEmployee = () => {
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
        };

        setLoading(true);
        fetchEmployee();
    }, [id, dispatch]);

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

    const handleDocumentTypeChange = (event, newAlignment) => {
        if (!newAlignment) {
            return;
        }

        setAlignment(newAlignment);
    };

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    if (isLoading || !documentTypesLoaded || !categoriesLoaded) {
        return <Spinner />;
    }

    return (
        <div className="EmployeeDocuments">
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
                    fetching={fetchingDocument}
                />
            )}

            {alignment === "QUALIFICATION_SHEET" && (
                <QualificationSheetForm
                    employee={employee}
                    principalCompany={principalCompany}
                    categories={categories}
                    fetchDocument={fetchDocument}
                    fetching={fetchingDocument}
                />
            )}

            {alignment === "PROFESSIONAL_REPORT" && (
                <ProfessionalReportForm
                    employee={employee}
                    principalCompany={principalCompany}
                    fetchDocument={fetchDocument}
                    fetching={fetchingDocument}
                />
            )}
        </div>
    );
};

export default EmployeeDocumentsPage;
