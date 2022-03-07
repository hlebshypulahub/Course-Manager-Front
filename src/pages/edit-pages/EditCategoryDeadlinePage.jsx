//// React
import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import validator from "validator";

//// Components
import MyTextField from "../../components/inputs/MyTextField";
import MyDatePicker from "../../components/inputs/MyDatePicker";
import FormButtons from "../../components/FormButtons";
import Spinner from "../../components/spinner/Spinner";
import MyModal from "../../components/modals/MyModal";

//// Mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//// Functions
import {
    getEmployeeById,
    patchEmployeeCategoryAssignmentDeadlineDate,
} from "../../services/employee.service";
import { DateParser as parse } from "../../helpers/DateParser";
import { DateFormatter as format } from "../../helpers/DateFormatter";

//// Utils
import { banana_color } from "../../helpers/color";

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
    const [modalShown, setModalShown] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);

    const history = useHistory();

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

                patchEmployeeCategoryAssignmentDeadlineDate(id, patch)
                    .then(
                        history.push({
                            pathname: `/employees/${id}`,
                            state: {
                                snackMessage: `Срок аттестации изменён`,
                            },
                        })
                    )
                    .catch(() => {
                        setModalShown(true);
                    });
            }
        },
        [id, categoryAssignmentDeadlineDate, history, validate]
    );

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    if (isLoading) {
        return <Spinner />;
    }

    const modal = modalShown && (
        <MyModal
            message="Отсутствует соединение с сервером..."
            func={() => {
                setModalShown(false);
            }}
        />
    );

    return (
        <div className="Form">
            {modal}

            <Card className="card">
                <CardContent
                    className="card-content"
                    style={{
                        backgroundColor: banana_color,
                    }}
                >
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

export default EditCategoryDeadlinePage;
