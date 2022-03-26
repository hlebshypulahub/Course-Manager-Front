//// React
import { useState, useCallback } from "react";

//// Components
import MyTextField from "../inputs/MyTextField";
import MyTextField120 from "../inputs/MyTextField120";
import FormButtons from "../FormButtons";

//// Mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//// Utils
import { banana_color } from "../../helpers/color";

//// Functions

//// CSS
import "../../pages/edit-pages/Form.scss";

const ProfessionalReportForm = ({
    employee,
    principalCompany,
    fetchDocument,
    fetching
}) => {
    const [mainInfo, setMainInfo] = useState(
        employee.fullName + ", " + employee.position + ", " + principalCompany
    );
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [text, setText] = useState("");

    const customMarginRight = { marginRight: "14px" };

    const handleSubmit = useCallback(
        (e) => {
            const documentDto = {
                mainInfo,
                startYear,
                endYear,
                text,
            };

            fetchDocument(e, documentDto, "professional-report");
        },
        [fetchDocument, mainInfo, startYear, endYear, text]
    );

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
                                -В отчете отражаются краткая характеристика
                                места работы (организации, структурного
                                подразделения, отделения, кабинета,
                                лаборатории), где работает данный работник,
                                оснащенность необходимым оборудованием, режим
                                (график) работы;
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
                            <FormButtons onlySubmit={true} submitting={fetching} />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfessionalReportForm;
