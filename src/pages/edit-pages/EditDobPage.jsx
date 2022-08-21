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

//// Functions
import {
    getEmployeeById,
    patchEmployee,
} from "../../services/employee.service";
import { parseDates as parse } from "../../helpers/parse-dates";
import { formatDates as format } from "../../helpers/format-dates";
import { arrayIsEmpty as isEmpty } from "../../helpers/array-is-empty";
import { handleFormSubmit } from "../../helpers/handle-form-submit";

//// CSS
import "./Form.scss";

const EditDobPage = (props) => {
    const id = props.match.params.id;
    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState({});
    const [dataLoaded, setDataLoaded] = useState(false);
    const [errors, setErrors] = useState({
        dob: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const { user: currentUser } = useSelector((state) => state.user);

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => (document.title = "Изменить дату рождения"), []);

    useEffect(() => {
        const fetchEmployee = () => {
            getEmployeeById(id).then((data) => {
                setFullName(data.fullName);
                setDob(parse(data.dob));
                setDataLoaded(true);
            });
        };

        fetchEmployee();
    }, [id]);

    const validate = useCallback(() => {
        let tempErrors = {};

        tempErrors.dob = validator.isDate(dob)
            ? ""
            : "Необходимо указать дату рождения";

        setErrors(tempErrors);

        return isEmpty(tempErrors);
    }, [dob]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (validate()) {
                const patch = {
                    type: "dob",
                    dob: format(dob),
                };

                setSubmitting(true);

                handleFormSubmit(
                    id,
                    history,
                    patch,
                    patchEmployee,
                    "Дата рождения изменена",
                    dispatch
                );
            }
        },
        [id, dob, history, validate, dispatch]
    );

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    if (!dataLoaded) {
        return <Spinner />;
    }

    return (
        <div className="Form">
            <Card className="card">
                <CardContent className="card-content">
                    <div className="card-label">
                        <span className="header-label">
                            Изменить образование
                        </span>
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
                            <MyDatePicker
                                error={errors.dob.length > 0}
                                helperText={errors.dob}
                                label="Дата рождения"
                                value={dob}
                                onChange={(newDate) => setDob(newDate)}
                                validate={validate}
                            />
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

export default EditDobPage;
