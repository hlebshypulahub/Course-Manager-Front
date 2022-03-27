//// React

import { useHistory } from "react-router-dom";

//// Mui
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

//// Utils
import { green, red } from "../../helpers/color";

const PersonalCard = ({
    withActions,
    employee,
    categoryIsValid,
    showCardActions,
    toggleEmployeeStateModalShown,
}) => {
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
            onClick={toggleEmployeeStateModalShown}
        >
            {employee.active ? "Активный" : "Неактивный"}
        </span>
    );

    const activePinTooltip = withActions ? (
        <Tooltip
            title="Нажмите, чтобы изменить состояние сотрудника"
            placement="top"
        >
            {activePin}
        </Tooltip>
    ) : (
        activePin
    );

    const noteButton = (
        <Button
            variant="outlined"
            style={{
                fontWeight: "bold",
                marginLeft: "8px",
            }}
            size="large"
            onClick={() => {
                history.push(`/employees/${employee.id}/note`);
            }}
        >
            Заметки
        </Button>
    );

    const noteButtonWithTooltip =
        !!employee.note || !!employee.notificationDate ? (
            <Tooltip
                title={
                    <div style={{ fontSize: "15px" }}>
                        {!!employee.note &&
                            employee.note
                                .split("\n")
                                .map((line) => <div key={line}>{line}</div>)}
                        <div style={{ marginTop: "10px" }}>
                            <span>Дата уведомления: </span>
                            <span>{employee.notificationDate}</span>
                        </div>
                    </div>
                }
                placement="right"
            >
                {noteButton}
            </Tooltip>
        ) : (
            noteButton
        );

    const cardActions = showCardActions && (
        <CardActions className="card-actions documents-btn">
            <Tooltip
                title={!categoryIsValid ? "Необходимо указать категорию" : ""}
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
                            history.push(`/employees/${employee.id}/documents`);
                        }}
                    >
                        Документы
                    </Button>
                </div>
            </Tooltip>

            {noteButtonWithTooltip}
        </CardActions>
    );

    return (
        <Card className="card main-info">
            <CardContent className="card-content">
                <div className="card-label-card">
                    <span className="header-label-card">
                        Персональные данные
                    </span>

                    {activePinTooltip}
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

                {cardActions}
            </CardContent>
        </Card>
    );
};

export default PersonalCard;
