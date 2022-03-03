import React, { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { banana_color, green, red, sky_blue, pink } from "../helpers/color";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { Redirect, useLocation, useHistory } from "react-router-dom";
import { CategoryValidator as validateCategory } from "../helpers/CategoryValidator";
import { EducationValidator as validateEducation } from "../helpers/EducationValidator";
import { DateParser as parse } from "../helpers/DateParser";

const PersonalCard = ({ withActions, ...props }) => {
    const employee = props.employee;
    const categoryIsValid = props.categoryIsValid;
    const showCardActions = props.showCardActions
        ? props.showCardActions
        : false;

    const history = useHistory();

    const activePin = (
        <span
            className="pin"
            style={
                employee.active
                    ? {
                          backgroundColor: green,
                      }
                    : {
                          backgroundColor: red,
                      }
            }
            onClick={props.toggleActiveAlert}
        >
            {employee.active ? "Активный" : "Неактивный"}
        </span>
    );

    return (
        <Card className="card main-info">
            <CardContent
                className="card-content"
            >
                <div className="card-label-card">
                    <span className="header-label-card">
                        Персональные данные
                    </span>
                    {withActions ? (
                        <Tooltip
                            title="Нажмите, чтобы изменить состояние сотрудника"
                            placement="top"
                        >
                            {activePin}
                        </Tooltip>
                    ) : (
                        activePin
                    )}
                </div>
                <div>
                    <span className="label-text">ФИО:</span>
                    <span className="value-text">{employee.fullName}</span>
                </div>
                <div>
                    <span className="label-text">Дата приема на работу:</span>
                    <span className="value-text">{employee.hiringDate}</span>
                </div>
                <div>
                    <span className="label-text">Место работы:</span>
                    <span className="value-text">{employee.jobFacility}</span>
                </div>
                <div>
                    <span className="label-text">Должность:</span>
                    <span className="value-text">{employee.position}</span>
                </div>
                {showCardActions && (
                    <CardActions className="card-actions documents-btn">
                        <Tooltip
                            title={
                                employee.exemptioned
                                    ? "Сотрудник освобождён"
                                    : !categoryIsValid
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
                                            `/employees/${employee.id}/documents`
                                        );
                                    }}
                                >
                                    Документы
                                </Button>
                            </div>
                        </Tooltip>
                    </CardActions>
                )}
            </CardContent>
        </Card>
    );
};

export default PersonalCard;
