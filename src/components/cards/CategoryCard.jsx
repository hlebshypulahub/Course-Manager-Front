//// React
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

//// Mui
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

//// Utils
import { green, red } from "../../helpers/color";

const CategoryCard = ({
    employee,
    categoryIsValid,
    educationIsValid,
    showCardActions,
}) => {
    const [clickCounter, setClickCounter] = useState(0);

    const history = useHistory();

    const manualEditButton = categoryIsValid && (
        <Tooltip
            title={
                clickCounter < 2 && !employee.exemptioned
                    ? "Нажмите 2 раза, чтобы вручную указать срок подтверждения категории"
                    : ""
            }
            placement="right"
        >
            <div
                onClick={() => {
                    setClickCounter(clickCounter + 1);
                }}
            >
                <Button
                    disabled={clickCounter < 1 || employee.exemptioned}
                    variant="outlined"
                    style={{
                        fontWeight: "bold",
                    }}
                    size="large"
                    onClick={() => {
                        history.push(
                            `/employees/${employee.id}/edit-category-deadline`
                        );
                    }}
                >
                    Указать вручную
                </Button>
            </div>
        </Tooltip>
    );

    const editButton = (
        <Tooltip
            title={
                employee.exemptioned
                    ? "Сотрудник освобождён"
                    : !educationIsValid
                    ? "Необходимо указать образование"
                    : ""
            }
            placement="right"
        >
            <div>
                <Button
                    disabled={!educationIsValid || employee.exemptioned}
                    variant="outlined"
                    style={{
                        fontWeight: "bold",
                    }}
                    size="large"
                    onClick={() => {
                        history.push(`/employees/${employee.id}/edit-category`);
                    }}
                >
                    {categoryIsValid ? "Изменить" : "Указать"}
                </Button>
            </div>
        </Tooltip>
    );

    const cardActions = showCardActions && (
        <CardActions className="card-actions">
            {editButton}

            {manualEditButton}
        </CardActions>
    );

    return (
        <Card className="card">
            <CardContent className="card-content">
                <div className="card-label-card">
                    <span className="header-label-card">Категория</span>

                    <span
                        className="pin"
                        style={
                            !employee.category
                                ? {
                                      backgroundColor: red,
                                  }
                                : {
                                      backgroundColor: green,
                                  }
                        }
                    >
                        {!employee.category
                            ? "Необходимо указать"
                            : employee.category.label}
                    </span>
                </div>

                <div>
                    <span className="label-text-large">Квалификация:</span>
                    <span className="value-text">{employee.qualification}</span>
                </div>

                <div>
                    <span className="label-text-large">Категория:</span>
                    <span className="value-text">
                        {employee.category ? employee.category.label : ""}
                    </span>
                </div>

                <div>
                    <span className="label-text-large">Номер:</span>
                    <span className="value-text">
                        {employee.categoryNumber}
                    </span>
                </div>

                <div>
                    <span className="label-text-large">Дата получения:</span>
                    <span className="value-text">
                        {employee.categoryAssignmentDate}
                    </span>
                </div>

                <div>
                    <span className="label-text-large">Срок аттестации:</span>
                    <span className="value-text">
                        {employee.categoryAssignmentDeadlineDate}
                    </span>
                </div>

                <div>
                    <span className="label-text-large">
                        Срок подачи документов:
                    </span>
                    <span className="value-text">
                        {employee.docsSubmitDeadlineDate}
                    </span>
                </div>

                <div>
                    <span className="label-text-large">
                        Возможное повышение категории после:
                    </span>
                    <span className="value-text">
                        {employee.categoryPossiblePromotionDate}
                    </span>
                </div>

                {cardActions}
            </CardContent>
        </Card>
    );
};

export default CategoryCard;
