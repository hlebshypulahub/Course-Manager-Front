//// React
import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

//// Components
import MyTextField from "./MyTextField";
import MyDatePicker from "./MyDatePicker";
import FormButtons from "./FormButtons";
import Spinner from "../components/Spinner";

//// Mui
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//// Functions
import { getCategories } from "../services/category.service";
import {
    getEmployeeById,
    patchEmployeeCategory,
} from "../services/employee.service";
import { DateParser as parse } from "../helpers/DateParser";
import { DateFormatter as format } from "../helpers/DateFormatter";
import { CategoryValidator as validateCategory } from "../helpers/CategoryValidator";
import { EmptyErrorTableChecker as isEmpty } from "../helpers/EmptyErrorTableChecker";

//// Utils
import { banana_color } from "../helpers/color";

//// CSS
import "../css/Form.scss";

const EditCategory = (props) => {
    const id = props.match.params.id;
    const [qualification, setQualification] = useState("");
    const [category, setCategory] = useState({ label: "", name: "" });
    const [categories, setCategories] = useState();
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

        return isEmpty(tempErrors);
    }, [qualification, category, categoryNumber, categoryAssignmentDate]);

    useEffect(() => {
        const fetchEmployee = () => {
            getEmployeeById(id).then((data) => {
                setFullName(data.fullName);
                setQualification(data.qualification || "");
                setCategory(data.category);
                setCategoryNumber(data.categoryNumber || "");
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
                    qualification,
                    category,
                    ...(categoryNumber && { categoryNumber }),
                    ...(categoryAssignmentDate && {
                        categoryAssignmentDate: format(categoryAssignmentDate),
                    }),
                };

                patchEmployeeCategory(id, patch).then(() => {
                    history.push({
                        pathname: `/employees/${id}`,
                        state: {
                            snackMessage: `Категория изменена`,
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

    const onChangeCategory = (e) => {
        const newCategoryLabel = e.target.value;
        const newCategory = categories.find(
            (c) => c.label === newCategoryLabel
        );
        setCategory(newCategory);
    };

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    if (!categoryLoaded || !categoriesLoaded) {
        return <Spinner />;
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
                        <span className="header-label">Изменить категорию</span>
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
                                error={errors.qualification.length > 0}
                                helperText={errors.qualification}
                                label="Квалификация"
                                value={qualification}
                                onChange={(e) =>
                                    setQualification(e.target.value)
                                }
                            />
                        </div>

                        <div className="input text-field">
                            <MyTextField
                                error={errors.category.length > 0}
                                helperText={errors.category}
                                value={category ? category.label : ""}
                                select
                                label="Категория"
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
                                label="Номер"
                                value={categoryNumber}
                                onChange={(e) =>
                                    setCategoryNumber(e.target.value)
                                }
                            />
                        </div>

                        <div className="input text-field">
                            <MyDatePicker
                                disabled={category && category.name === "NONE"}
                                error={errors.categoryAssignmentDate.length > 0}
                                helperText={errors.categoryAssignmentDate}
                                label="Дата получения"
                                value={categoryAssignmentDate}
                                onChange={(newDate) =>
                                    setCategoryAssignmentDate(newDate)
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

export default EditCategory;
