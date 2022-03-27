//// React
import { useState } from "react";
import { useHistory } from "react-router-dom";

//// Mui
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";

//// Utils
import { green, red } from "../../helpers/color";

const EducationCard = ({ employee, educationIsValid }) => {
    const [shownEducation, setShownEducation] = useState(false);

    const history = useHistory();

    return (
        <Tooltip
            title={shownEducation ? "" : "Нажмите, чтобы развернуть"}
            followCursor
        >
            <Card
                className="card"
                onClick={() => setShownEducation(!shownEducation)}
            >
                <CardContent className="card-content">
                    <div className="card-label-card">
                        <span className="header-label-card">Образование</span>

                        <span
                            className="pin"
                            style={
                                employee.education
                                    ? { backgroundColor: green }
                                    : {
                                          backgroundColor: red,
                                      }
                            }
                        >
                            {employee.education
                                ? employee.education.label
                                : "Необходимо указать"}
                        </span>
                    </div>

                    <Collapse in={shownEducation} timeout={500}>
                        <div className="info-row">
                            <span className="label-text">Уровень:</span>

                            <span className="value-text">
                                {employee.education && employee.education.label}
                            </span>
                        </div>

                        <div className="info-row">
                            <span className="label-text">УО:</span>
                            <span className="value-text">
                                {employee.eduName}
                            </span>
                        </div>

                        <div className="info-row">
                            <span className="label-text">Дата окончания:</span>
                            <span className="value-text">
                                {employee.eduGraduationDate}
                            </span>
                        </div>

                        <CardActions className="card-actions">
                            <Button
                                variant="outlined"
                                style={{
                                    fontWeight: "bold",
                                }}
                                size="large"
                                onClick={() => {
                                    history.push(
                                        `/employees/${employee.id}/edit-edu`
                                    );
                                }}
                            >
                                {educationIsValid ? "Изменить" : "Указать"}
                            </Button>
                        </CardActions>
                    </Collapse>
                </CardContent>
            </Card>
        </Tooltip>
    );
};

export default EducationCard;
