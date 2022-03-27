//// React
import { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import validator from "validator";

//// Components
import MyTextField from "../../components/inputs/MyTextField";
import MyDatePicker from "../../components/inputs/MyDatePicker";
import FormButtons from "../../components/FormButtons";
import Spinner from "../../components/spinner/Spinner";

//// Mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//// Functions
import {
    getEmployeeById,
    patchEmployeeCategoryAssignmentDeadlineDate,
} from "../../services/employee.service";
import { parseDates as parse } from "../../helpers/parse-dates";
import { formatDates as format } from "../../helpers/format-dates";
import { handleFormSubmit } from "../../helpers/handle-form-submit";

//// CSS
import "./Form.scss";

const EditCategoryDeadlinePage = (props) => {
    const id = props.match.params.id;
    const [categoryAssignmentDeadlineDate, setCategoryAssignmentDeadlineDate] =
        useState({});
    const [fullName, setFullName] = useState("");
    const [errors, setErrors] = useState({
        categoryAssignmentDeadlineDate: "",
    });
    const [isLoading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { user: currentUser } = useSelector((state) => state.user);

    const history = useHistory();
    const dispatch = useDispatch();

    const validate = useCallback(() => {
        let tempErrors = {};

        tempErrors.categoryAssignmentDeadlineDate = validator.isDate(
            categoryAssignmentDeadlineDate
        )
            ? ""
            : "Необходимо указать срок аттестации";

        setErrors(tempErrors);

        return Object.values(tempErrors).every((item) => item === "");
    }, [categoryAssignmentDeadlineDate]);

    useEffect(() => {
        const fetchEmployee = () => {
            getEmployeeById(id).then((data) => {
                setFullName(data.fullName);
                setCategoryAssignmentDeadlineDate(
                    parse(data.categoryAssignmentDeadlineDate)
                );
                setLoading(false);
            });
        };

        setLoading(true);
        fetchEmployee();
    }, [id]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (validate()) {
                const patch = {
                    categoryAssignmentDeadlineDate: format(
                        categoryAssignmentDeadlineDate
                    ),
                };

                setSubmitting(true);

                handleFormSubmit(
                    id,
                    history,
                    patch,
                    patchEmployeeCategoryAssignmentDeadlineDate,
                    "Срок аттестации изменён",
                    dispatch
                );
            }
        },
        [id, categoryAssignmentDeadlineDate, history, validate, dispatch]
    );

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="Form">
            <Card className="card">
                <CardContent className="card-content">
                    <div className="card-label">
                        <span className="header-label">
                            Изменить срок аттестации на категорию вручную
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
                                error={
                                    errors.categoryAssignmentDeadlineDate
                                        .length > 0
                                }
                                helperText={
                                    errors.categoryAssignmentDeadlineDate
                                }
                                label="Срок аттестации"
                                value={categoryAssignmentDeadlineDate}
                                onChange={(newDate) =>
                                    setCategoryAssignmentDeadlineDate(newDate)
                                }
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

export default EditCategoryDeadlinePage;
