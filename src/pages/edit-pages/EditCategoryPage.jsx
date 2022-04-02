//// React
import { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//// Components
import MyTextField from "../../components/inputs/MyTextField";
import MyDatePicker from "../../components/inputs/MyDatePicker";
import FormButtons from "../../components/FormButtons";
import Spinner from "../../components/spinner/Spinner";

//// Mui
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//// Functions
import { getCategories } from "../../services/category.service";
import {
    getEmployeeById,
    patchEmployee,
} from "../../services/employee.service";
import { parseDates as parse } from "../../helpers/parse-dates";
import { formatDates as format } from "../../helpers/format-dates";
import { validateCategory } from "../../helpers/validate-category";
import { arrayIsEmpty as isEmpty } from "../../helpers/array-is-empty";
import { handleFormSubmit } from "../../helpers/handle-form-submit";

//// CSS
import "./Form.scss";

const EditCategoryPage = (props) => {
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
    const [submitting, setSubmitting] = useState(false);

    const { user: currentUser } = useSelector((state) => state.user);

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => (document.title = "Изменить категорию"), []);

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
                    type: "category",
                    qualification,
                    category: category.name,
                    ...(categoryNumber && { categoryNumber }),
                    ...(categoryAssignmentDate && {
                        categoryAssignmentDate: format(categoryAssignmentDate),
                    }),
                };

                setSubmitting(true);

                handleFormSubmit(
                    id,
                    history,
                    patch,
                    patchEmployee,
                    "Категория изменена",
                    dispatch
                );
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
            dispatch,
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
                <CardContent className="card-content">
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
                                onBlur={() => {
                                    if (errors.qualification.length > 0)
                                        validate();
                                }}
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
                                onBlur={() => {
                                    if (errors.category.length > 0) validate();
                                }}
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
                                onBlur={() => {
                                    if (errors.categoryNumber.length > 0)
                                        validate();
                                }}
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

export default EditCategoryPage;
