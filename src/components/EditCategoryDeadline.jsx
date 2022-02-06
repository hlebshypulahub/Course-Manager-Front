import React, { useState, useEffect, useCallback } from "react";
import MyTextField from "./MyTextField";
import MyDatePicker from "./MyDatePicker";

import { useHistory } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormButtons from "./FormButtons";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import Spinner from "../components/Spinner";

import {
    getEmployeeById,
    patchEmployeeCategoryAssignmentDeadlineDate,
} from "../services/employee.service";
import { DateParser as parse } from "../helpers/DateParser";
import { DateFormatter as format } from "../helpers/DateFormatter";
import validator from "validator";

import { banana_color } from "../helpers/color";
import "../css/Form.scss";

const EditCategoryDeadline = (props) => {
    const id = props.match.params.id;
    const [categoryAssignmentDeadlineDate, setCategoryAssignmentDeadlineDate] =
        useState({});
    const [fullName, setFullName] = useState("");
    const [errors, setErrors] = useState({
        categoryAssignmentDeadlineDate: "",
    });
    const [isLoading, setLoading] = useState(true);
    const { user: currentUser } = useSelector((state) => state.auth);

    const history = useHistory();

    const validate = useCallback(() => {
        let tempErrors = {};

        tempErrors.categoryAssignmentDeadlineDate = validator.isDate(
            categoryAssignmentDeadlineDate
        )
            ? ""
            : "Należy podać datę terminu potwierdzenia kategorii";

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

        fetchEmployee();
    }, [id]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (validate()) {
                const patch = {
                    ...(categoryAssignmentDeadlineDate && {
                        categoryAssignmentDeadlineDate: format(
                            categoryAssignmentDeadlineDate
                        ),
                    }),
                };

                patchEmployeeCategoryAssignmentDeadlineDate(id, patch).then(
                    () => {
                        history.push(`/employees/${id}`);
                    }
                );
            }
        },
        [id, categoryAssignmentDeadlineDate, history, validate]
    );

    useEffect(() => {
        validate();
    }, [validate]);

    const onChangeCategoryAssignmentDeadlineDate = (
        newCategoryAssignmentDeadlineDate
    ) => {
        if (!newCategoryAssignmentDeadlineDate) {
            setErrors({
                ...errors,
                categoryAssignmentDeadlineDate:
                    "Należy podać datę ukończenia stodiów",
            });
        }
        setCategoryAssignmentDeadlineDate(newCategoryAssignmentDeadlineDate);
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="Form">
            <Card className="card">
                <CardContent
                    className="card-content"
                    style={{
                        backgroundColor: banana_color,
                    }}
                >
                    <div className="card-label">
                        <span className="header-label">
                            Edytuj termin potwierdzenia kategorii ręcznie
                        </span>
                    </div>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input text-field">
                            <MyTextField
                                disabled
                                label="Imię i nazwisko"
                                value={fullName ? fullName : ""}
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
                                label="Data terminu potwierdzenia kategorii"
                                value={categoryAssignmentDeadlineDate}
                                onChange={
                                    onChangeCategoryAssignmentDeadlineDate
                                }
                            />
                        </div>
                        <div className="buttons">
                            <FormButtons />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditCategoryDeadline;
