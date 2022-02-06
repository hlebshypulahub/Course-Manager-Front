import React, { useState, useEffect, useCallback } from "react";
import MyTextField from "./MyTextField";
import MyDatePicker from "./MyDatePicker";
import MenuItem from "@mui/material/MenuItem";

import { useHistory } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormButtons from "./FormButtons";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import Spinner from "../components/Spinner";

import { getCategories } from "../services/category.service";
import {
    getEmployeeById,
    patchEmployeeCategory,
} from "../services/employee.service";
import { DateParser as parse } from "../helpers/DateParser";
import { DateFormatter as format } from "../helpers/DateFormatter";
import { FalseObjectChecker as isFalseObject } from "../helpers/FalseObjectChecker";
import { CategoryValidator as validateCategory } from "../helpers/CategoryValidator";

import { banana_color } from "../helpers/color";
import "../css/Form.scss";

const EditCategory = (props) => {
    const id = props.match.params.id;
    const [qualification, setQualification] = useState("");
    const [category, setCategory] = useState({ label: "", name: "" });
    const [categories, setCategories] = useState([]);
    const [categoryNumber, setCategoryNumber] = useState("");
    const [categoryAssignmentDate, setCategoryAssignmentDate] = useState({});
    const [fullName, setFullName] = useState("");
    const [errors, setErrors] = useState({
        qualification: "",
        category: "",
        categoryNumber: "",
        categoryAssignmentDate: "",
    });
    const [categoryLoaded, setCategoryLoaded] = useState(false);
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    const { user: currentUser } = useSelector((state) => state.auth);

    const history = useHistory();

    useEffect(() => {
        const fetchCategories = () => {
            getCategories().then((data) => {
                setCategories(data);
                setCategoriesLoaded(true);
            });
        };

        fetchCategories();
    }, []);

    const validate = useCallback(() => {
        const tempErrors = validateCategory(
            qualification,
            category,
            categoryNumber,
            categoryAssignmentDate
        );

        setErrors(tempErrors);

        return Object.values(tempErrors).every((item) => item === "");
    }, [qualification, category, categoryNumber, categoryAssignmentDate]);

    useEffect(() => {
        const fetchEmployee = () => {
            getEmployeeById(id).then((data) => {
                setFullName(data.fullName);
                setQualification(data.qualification);
                setCategory(data.category);
                setCategoryNumber(data.categoryNumber);
                setCategoryAssignmentDate(parse(data.categoryAssignmentDate));
                setCategoryLoaded(true);
            });
        };

        fetchEmployee();
    }, [id]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (validate()) {
                const patch = {
                    ...(qualification && { qualification }),
                    ...(category && { category: category.name }),
                    ...(categoryNumber && { categoryNumber }),
                    ...(categoryAssignmentDate && {
                        categoryAssignmentDate: format(categoryAssignmentDate),
                    }),
                };

                patchEmployeeCategory(id, patch).then(() => {
                    history.push({
                        pathname: `/employees/${id}`,
                        state: {
                            snackMessage: `Kategoria została zmieniona`,
                        },
                    });
                });
            }
        },
        [
            id,
            qualification,
            category,
            categoryNumber,
            categoryAssignmentDate,
            history,
            validate,
        ]
    );

    useEffect(() => {
        validate();
    }, [validate]);

    const onChangeQualification = (e) => {
        const newQualification = e.target.value;
        setQualification(newQualification);
    };

    const onChangeCategory = (e) => {
        const newCategoryLabel = e.target.value;
        const newCategory = categories.find(
            (c) => c.label === newCategoryLabel
        );
        setCategory(!isFalseObject(newCategory) ? newCategory : {});
    };

    const onChangeCategoryNumber = (e) => {
        const newCategoryNumber = e.target.value;
        setCategoryNumber(newCategoryNumber);
    };

    const onChangeCategoryAssignmentDate = (newCategoryAssignmentDate) => {
        if (!newCategoryAssignmentDate) {
            setErrors({
                ...errors,
                eduGraduationDate: "Należy podać datę ukończenia stodiów",
            });
        }
        setCategoryAssignmentDate(newCategoryAssignmentDate);
    };

    if (!categoryLoaded || !categoriesLoaded) {
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
                        <span className="header-label">Edytuj kategorię</span>
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
                            <MyTextField
                                error={errors.qualification.length > 0}
                                helperText={errors.qualification}
                                label="Kwalifikacja"
                                value={qualification ? qualification : ""}
                                onChange={onChangeQualification}
                            />
                        </div>
                        <div className="input text-field">
                            <MyTextField
                                error={errors.category.length > 0}
                                helperText={errors.category}
                                value={category ? category.label : ""}
                                select
                                label="Rodzaj"
                                onChange={onChangeCategory}
                            >
                                {categories.map((c) => {
                                    return (
                                        <MenuItem key={c.name} value={c.label}>
                                            {c.label}
                                        </MenuItem>
                                    );
                                })}
                            </MyTextField>
                        </div>
                        <div className="input text-field">
                            <MyTextField
                                disabled={category && category.name === "NONE"}
                                error={errors.categoryNumber.length > 0}
                                helperText={errors.categoryNumber}
                                label="Numer"
                                value={categoryNumber ? categoryNumber : ""}
                                onChange={onChangeCategoryNumber}
                            />
                        </div>
                        <div className="input text-field">
                            <MyDatePicker
                                disabled={category && category.name === "NONE"}
                                error={errors.categoryAssignmentDate.length > 0}
                                helperText={errors.categoryAssignmentDate.toString()}
                                label="Data nadania"
                                value={categoryAssignmentDate}
                                onChange={onChangeCategoryAssignmentDate}
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

export default EditCategory;
