//// React
import { useState } from "react";
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
    employee: {
        id,
        exemptioned,
        category,
        qualification,
        categoryAssignmentDate,
        categoryNumber,
        categoryAssignmentDeadlineDate,
        categoryPossiblePromotionDate,
        docsSubmitDeadlineDate,
    },
    categoryIsValid,
    educationIsValid,
    showCardActions,
}) => {
    const [clickCounter, setClickCounter] = useState(0);

    const history = useHistory();

    const manualEditButton = categoryIsValid && (
        <Tooltip
            title={
                clickCounter < 2 && !exemptioned
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
                    disabled={clickCounter < 1 || exemptioned}
                    variant="outlined"
                    style={{
                        fontWeight: "bold",
                    }}
                    size="large"
                    onClick={() => {
                        history.push(`/employees/${id}/edit-category-deadline`);
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
                exemptioned
                    ? "Сотрудник освобождён"
                    : !educationIsValid
                    ? "Необходимо указать образование"
                    : ""
            }
            placement="right"
        >
            <div>
                <Button
                    disabled={!educationIsValid || exemptioned}
                    variant="outlined"
                    style={{
                        fontWeight: "bold",
                    }}
                    size="large"
                    onClick={() => {
                        history.push(`/employees/${id}/edit-category`);
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
                            !category
                                ? {
                                      backgroundColor: red,
                                  }
                                : {
                                      backgroundColor: green,
                                  }
                        }
                    >
                        {!category ? "Необходимо указать" : category.label}
                    </span>
                </div>

                <div>
                    <span className="label-text-large">Квалификация:</span>
                    <span className="value-text">{qualification}</span>
                </div>

                <div>
                    <span className="label-text-large">Категория:</span>
                    <span className="value-text">
                        {category ? category.label : ""}
                    </span>
                </div>

                <div>
                    <span className="label-text-large">Номер:</span>
                    <span className="value-text">{categoryNumber}</span>
                </div>

                <div>
                    <span className="label-text-large">Дата получения:</span>
                    <span className="value-text">{categoryAssignmentDate}</span>
                </div>

                <div>
                    <span className="label-text-large">Срок аттестации:</span>
                    <span className="value-text">
                        {categoryAssignmentDeadlineDate}
                    </span>
                </div>

                <div>
                    <span className="label-text-large">
                        Срок подачи документов:
                    </span>
                    <span className="value-text">{docsSubmitDeadlineDate}</span>
                </div>

                <div>
                    <span className="label-text-large">
                        Возможное повышение категории после:
                    </span>
                    <span className="value-text">
                        {categoryPossiblePromotionDate}
                    </span>
                </div>

                {cardActions}
            </CardContent>
        </Card>
    );
};

export default CategoryCard;
