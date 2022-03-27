//// React
import { useState, useEffect, useCallback } from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import validator from "validator";

//// Components
import MyTextField from "../../components/inputs/MyTextField";
import MyDatePicker from "../../components/inputs/MyDatePicker";
import Spinner from "../../components/spinner/Spinner";
import FormButtons from "../../components/FormButtons";

//// Mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";

//// Functions
import {
    getEmployeeById,
    patchEmployeeNote,
} from "../../services/employee.service";
import { parseDates as parse } from "../../helpers/parse-dates";
import { formatDates as format } from "../../helpers/format-dates";
import { arrayIsEmpty as isEmpty } from "../../helpers/array-is-empty";
import { handleFormSubmit } from "../../helpers/handle-form-submit";

//// CSS
import "./Form.scss";

const EditNotePage = (props) => {
    const id = props.match.params.id;
    const [noteLoaded, setNoteLoaded] = useState(false);
    const [note, setNote] = useState("");
    const [shouldExtendNotification, setShouldExtendNotification] =
        useState(false);
    const [notificationDate, setNotificationDate] = useState({});
    const [fullName, setFullName] = useState("");
    const [errors, setErrors] = useState({
        notificationDate: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const { user: currentUser } = useSelector((state) => state.user);

    const history = useHistory();
    const dispatch = useDispatch();

    const validate = useCallback(() => {
        let tempErrors = {};
        tempErrors.notificationDate =
            !notificationDate || validator.isDate(notificationDate)
                ? ""
                : "Необходимо указать дату уведомления";

        setErrors(tempErrors);

        return isEmpty(tempErrors);
    }, [notificationDate]);

    useEffect(() => {
        const fetchEmployee = () => {
            getEmployeeById(id).then((data) => {
                setFullName(data.fullName);
                setNote(data.note || "");
                setNotificationDate(parse(data.notificationDate));
                setShouldExtendNotification(data.shouldExtendNotification);
                setNoteLoaded(true);
            });
        };

        fetchEmployee();
    }, [id]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (validate()) {
                const patch = {
                    note,
                    notificationDate: format(notificationDate),
                    shouldExtendNotification,
                };

                setSubmitting(true);

                handleFormSubmit(
                    id,
                    history,
                    patch,
                    patchEmployeeNote,
                    "Заметки изменены",
                    dispatch
                );
            }
        },
        [
            id,
            history,
            note,
            notificationDate,
            shouldExtendNotification,
            validate,
            dispatch
        ]
    );

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    if (!noteLoaded) {
        return <Spinner />;
    }

    return (
        <div className="Form">
            <Card className="card">
                <CardContent className="card-content">
                    <div className="card-label">
                        <span className="header-label">Заметки</span>
                    </div>

                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input text-field">
                            <MyTextField
                                disabled
                                label="ФИО"
                                value={fullName}
                            />
                        </div>

                        <div className="input text-field">
                            <MyTextField
                                label="Заметки"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                onBlur={() => validate()}
                                multiline
                            />
                        </div>

                        <div
                            className="combined-row"
                            style={{ marginTop: "25px" }}
                        >
                            <div className="input text-field">
                                <MyDatePicker
                                    small
                                    error={errors.notificationDate.length > 0}
                                    helperText={errors.notificationDate}
                                    label="Дата уведомления"
                                    value={notificationDate}
                                    onChange={(newDate) =>
                                        setNotificationDate(newDate)
                                    }
                                    validate={validate}
                                />
                            </div>

                            <Checkbox
                                style={{
                                    marginLeft: "100px",
                                    marginTop: "-6px",
                                }}
                                checked={shouldExtendNotification}
                                onChange={(e) =>
                                    setShouldExtendNotification(
                                        e.target.checked
                                    )
                                }
                                inputProps={{ "aria-label": "controlled" }}
                            />

                            <span
                                style={{ marginLeft: "10px" }}
                                className="text1"
                            >
                                Продлевать автоматически
                            </span>

                            <Tooltip
                                style={{
                                    position: "absolute",
                                    display: "inline-block",
                                    marginLeft: "10px",
                                    marginTop: "17px",
                                }}
                                title="После отправки дата уведомления будет автоматически продлеваться на сутки."
                                placement="top"
                            >
                                <HelpIcon />
                            </Tooltip>
                        </div>

                        <div className="buttons">
                            <FormButtons submitting={submitting} />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditNotePage;
