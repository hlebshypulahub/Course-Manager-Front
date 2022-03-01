//// React
import { useState, useEffect, useCallback } from "react";
import validator from "validator";

//// Components
import MyTextField from "./MyTextField";
import CustomTextField from "./CustomTextField";
import MyTextField120 from "./MyTextField120";
import FormButtons from "./FormButtons";
import Spinner from "../components/Spinner";
import MyDatePicker from "./MyDatePicker";
import PastJobFields from "./PastJobFields";

//// Mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";

//// Utils
import { banana_color } from "../helpers/color";

//// Functions
import { getDocumentForEmployee } from "../services/employee.service";
import { DateParser as parse } from "../helpers/DateParser";
import { FalseObjectChecker as isFalseObject } from "../helpers/FalseObjectChecker";
import { DateFormatter as format } from "../helpers/DateFormatter";
import { MapToArray as mapToArray } from "../helpers/MapToArray";

//// CSS
import "../css/Form.scss";

const ProfessionalReportForm = ({ employee, principalCompany }) => {
    const [mainInfo, setMainInfo] = useState(
        employee.fullName + ", " + employee.position + ", " + principalCompany
    );
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [text, setText] = useState("");

    const [isDocumentLoading, setDocumentLoading] = useState(false);

    const customMarginRight = { marginRight: "14px" };

    const fetchDocument = useCallback(
        (e, documentDto) => {
            e.preventDefault();

            setDocumentLoading(true);

            getDocumentForEmployee(
                employee.id,
                documentDto,
                "professional-report"
            )
                .then(() => {
                    setDocumentLoading(false);
                })
                .catch(() => {});
        },
        [employee.id]
    );

    const handleSubmit = useCallback(
        (e) => {
            const documentDto = {
                mainInfo,
                startYear,
                endYear,
                text,
            };

            fetchDocument(e, documentDto);
        },
        [fetchDocument, mainInfo, startYear, endYear, text]
    );

    if (isDocumentLoading) {
        return <Spinner />;
    }

    return (
        <div className="Form">
            <Card className="card">
                <CardContent
                    className="card-content"
                    style={{
                        backgroundColor: banana_color,
                    }}
                >
                    <div className="card-label">
                        <span className="header-label">
                            Отчет о профессиональной деятельности
                        </span>
                    </div>

                    <form className="form" onSubmit={handleSubmit}>
                        <div
                            style={{
                                marginBottom: "-15px",
                            }}
                            className="combined-row"
                        >
                            <span style={customMarginRight} className="text2">
                                Фамилия, собственное имя, отчество (если таковое
                                имеется), должность служащего, организация,
                                индивидуальный предприниматель, где работает
                                данный работник):
                            </span>
                        </div>

                        <div className="text-field">
                            <MyTextField
                                value={mainInfo}
                                onChange={(e) => setMainInfo(e.target.value)}
                                multiline
                            />
                        </div>

                        <div className="combined-row">
                            <span style={customMarginRight} className="text2">
                                За период с
                            </span>
                            <div style={customMarginRight} className="input">
                                <MyTextField120
                                    value={startYear}
                                    label="Год"
                                    onChange={(e) =>
                                        setStartYear(e.target.value)
                                    }
                                />
                            </div>
                            <span className="text2" style={customMarginRight}>
                                по
                            </span>
                            <div className="input">
                                <MyTextField120
                                    value={endYear}
                                    label="Год"
                                    onChange={(e) => setEndYear(e.target.value)}
                                />
                            </div>
                        </div>

                        <div
                            style={{
                                marginBottom: "-15px",
                            }}
                            className="combined-row"
                        >
                            <span style={customMarginRight} className="text2">
                                -В отчете отражаются краткая характеристика места
                                работы (организации, структурного подразделения,
                                отделения, кабинета, лаборатории), где работает
                                данный работник, оснащенность необходимым
                                оборудованием, режим (график) работы;
                                <br />
                                -Имеющиеся у работника знания и практические
                                навыки;
                                <br />
                                -Анализ профессиональной деятельности,
                                статистические данные, количественные и
                                качественные показатели работы;
                                <br />
                                -Формы и методы повышения профессионального
                                уровня знаний;
                                <br />
                                -Выводы и предложения по улучшению качества
                                профессиональной деятельности.
                            </span>
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="Отчет"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                multiline
                            />
                        </div>

                        <div className="buttons">
                            <FormButtons onlySubmit={true} />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfessionalReportForm;
