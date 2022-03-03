//// React
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

//// Mui
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";

//// Utils
import { green, red } from "../helpers/color";

const ExemptionCard = ({ employee, categoryIsValid, deleteExemption }) => {
    const [shownExemption, setShownExemption] = useState(false);

    const history = useHistory();

    return (
        <Tooltip
            title={shownExemption ? "" : "Нажмите, чтобы развернуть"}
            followCursor
        >
            <Card
                className="card"
                onClick={() => setShownExemption(!shownExemption)}
            >
                <CardContent className="card-content">
                    <div className="card-label-card">
                        <span className="header-label-card">Освобождение</span>

                        <span
                            className="pin"
                            style={
                                employee.exemptioned
                                    ? {
                                          backgroundColor: red,
                                      }
                                    : {
                                          backgroundColor: green,
                                      }
                            }
                        >
                            {employee.exemptioned ? "Освобождён" : "Нет"}
                        </span>
                    </div>

                    <Collapse in={shownExemption} timeout={500}>
                        {employee.exemption && (
                            <div>
                                <div className="info-row">
                                    <span className="label-text">Причина:</span>
                                    <span className="value-text">
                                        {employee.exemption &&
                                            employee.exemption.label}
                                    </span>
                                </div>

                                <div className="info-row">
                                    <span className="label-text">
                                        Дата начала:
                                    </span>
                                    <span className="value-text">
                                        {employee.exemptionStartDate}
                                    </span>
                                </div>

                                <div className="info-row">
                                    <span className="label-text">
                                        Дата окончания:
                                    </span>
                                    <span className="value-text">
                                        {employee.exemptionEndDate}
                                    </span>
                                </div>
                            </div>
                        )}

                        <CardActions className="card-actions">
                            <Tooltip
                                title={
                                    !categoryIsValid
                                        ? "Необходимо указать категорию"
                                        : ""
                                }
                                placement="right"
                            >
                                <div>
                                    <Button
                                        disabled={!categoryIsValid}
                                        variant="outlined"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        size="large"
                                        onClick={() => {
                                            history.push(
                                                `${employee.id}/edit-exemption`
                                            );
                                        }}
                                    >
                                        {employee.exemptioned
                                            ? "Изменить"
                                            : "Указать"}
                                    </Button>
                                </div>
                            </Tooltip>

                            {employee.exemptioned && (
                                <Button
                                    variant="outlined"
                                    style={{
                                        fontWeight: "bold",
                                        marginLeft: "8px",
                                    }}
                                    size="large"
                                    onClick={deleteExemption}
                                >
                                    Удалить
                                </Button>
                            )}
                        </CardActions>
                    </Collapse>
                </CardContent>
            </Card>
        </Tooltip>
    );
};

export default ExemptionCard;
