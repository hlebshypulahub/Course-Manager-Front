//// React
import { useHistory } from "react-router-dom";

//// Mui
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

//// Utils
import { green, red } from "../../helpers/color";

const PersonalCard = ({
    withActions,
    employee: {
        id,
        fullName,
        hiringDate,
        jobFacility,
        position,
        dob,
        note,
        notificationDate,
        active,
        partTime,
    },
    categoryIsValid,
    showCardActions,
    toggleEmployeeStateModalShown,
    handleToggleEmployeePartTimeSubmit,
}) => {
    const history = useHistory();

    const activePin = (
        <span
            className="pin"
            style={
                active
                    ? {
                          backgroundColor: green,
                      }
                    : {
                          backgroundColor: red,
                      }
            }
            onClick={toggleEmployeeStateModalShown}
        >
            {active ? "Активный" : "Неактивный"}
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
                history.push(`/employees/${id}/note`);
            }}
        >
            Заметки
        </Button>
    );

    const noteButtonWithTooltip =
        !!note || !!notificationDate ? (
            <Tooltip
                title={
                    <div style={{ fontSize: "15px" }}>
                        {!!note &&
                            note
                                .split("\n")
                                .map((line) => <div key={line}>{line}</div>)}
                        <div style={{ marginTop: "10px" }}>
                            <span>Дата уведомления: </span>
                            <span>{notificationDate}</span>
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
                            history.push(`/employees/${id}/documents`);
                        }}
                    >
                        Документы
                    </Button>
                </div>
            </Tooltip>

            {noteButtonWithTooltip}
        </CardActions>
    );

    const dobSpan = (
        <span
            className="value-text"
            onClick={() => history.push(`/employees/${id}/edit-dob`)}
            style={{ cursor: "pointer" }}
        >
            {dob ? dob : "Указать"}
        </span>
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
                    <span className="value-text">{fullName}</span>
                </div>

                <div>
                    <span className="label-text">Дата приема на работу:</span>
                    <span className="value-text">{hiringDate}</span>
                </div>

                <div className="job-row">
                    <span className="label-text label-text-job">
                        Место работы:
                    </span>
                    <span
                        className="value-text value-text-job"
                        style={{ marginRight: "20px" }}
                    >
                        {jobFacility}
                    </span>
                    <span className="checkbox-job">
                        <Checkbox
                            style={{
                                width: "20px",
                                height: "20px",
                                marginTop: "1px",
                            }}
                            checked={partTime}
                            onChange={(e) =>
                                handleToggleEmployeePartTimeSubmit(e)
                            }
                            inputProps={{ "aria-label": "controlled" }}
                        />
                        <span
                            style={{
                                fontSize: "18px",
                                fontWeight: "500",
                                marginLeft: "5px",
                                // marginTop: "10px",
                                display: "inline-flex",
                                alignItems: "center",
                            }}
                            className="value-text"
                        >
                            По совмес-ву
                        </span>
                    </span>
                </div>

                <div>
                    <span className="label-text">Должность:</span>
                    <span className="value-text">{position}</span>
                </div>

                <div>
                    <span className="label-text">Дата рождения:</span>
                    {dobSpan}
                </div>

                {cardActions}
            </CardContent>
        </Card>
    );
};

export default PersonalCard;
