//// React
import { useState, useEffect, useCallback } from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

//// Components
import MyTextField from "../../components/inputs/MyTextField";
import MyDatePicker from "../../components/inputs/MyDatePicker";
import Spinner from "../../components/spinner/Spinner";
import FormButtons from "../../components/FormButtons";

//// Mui
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//// Functions
import { getExemptions } from "../../services/exemption.service";
import {
    getEmployeeById,
    patchEmployee,
} from "../../services/employee.service";
import { validateExemption } from "../../helpers/validate-exemption";
import { parseDates as parse } from "../../helpers/parse-dates";
import { formatDates as format } from "../../helpers/format-dates";
import { arrayIsEmpty as isEmpty } from "../../helpers/array-is-empty";
import { handleFormSubmit } from "../../helpers/handle-form-submit";

//// CSS
import "./Form.scss";

const EditExemptionPage = (props) => {
    const id = props.match.params.id;
    const [exemptionIsLoaded, setExemptionLoaded] = useState(false);
    const [exemptionsIsLoaded, setExemptionsLoaded] = useState(false);
    const [exemption, setExemption] = useState({
        label: "",
        name: "",
        monthandleFormSubmitDuration: "",
        monthandleFormSubmitOfExemption: "",
    });
    const [exemptions, setExemptions] = useState();
    const [exemptionStartDate, setExemptionStartDate] = useState({});
    const [exemptionEndDate, setExemptionEndDate] = useState({});
    const [errors, setErrors] = useState({
        exemption: "",
        exemptionStartDate: "",
        exemptionEndDate: "",
    });
    const [fullName, setFullName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { user: currentUser } = useSelector((state) => state.user);

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => (document.title = "Изменить освобождение"), []);

    useEffect(() => {
        const fetchExemptions = () => {
            getExemptions().then((data) => {
                setExemptions(data);
                setExemptionsLoaded(true);
            });
        };

        fetchExemptions();
    }, []);

    const validate = useCallback(() => {
        const tempErrors = validateExemption(
            exemption,
            exemptionStartDate,
            exemptionEndDate
        );

        setErrors(tempErrors);

        return isEmpty(tempErrors);
    }, [exemption, exemptionStartDate, exemptionEndDate]);

    useEffect(() => {
        const fetchEmployee = () => {
            getEmployeeById(id).then((data) => {
                setFullName(data.fullName || "");
                setExemptionStartDate(parse(data.exemptionStartDate));
                setExemptionEndDate(parse(data.exemptionEndDate));
                setExemption(data.exemption);
                setExemptionLoaded(true);
            });
        };

        fetchEmployee();
    }, [id]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (validate()) {
                const patch = {
                    type: "exemption",
                    exemption: exemption.name,
                    exemptionStartDate: format(exemptionStartDate),
                    ...(exemptionEndDate && {
                        exemptionEndDate: format(exemptionEndDate),
                    }),
                };

                setSubmitting(true);

                handleFormSubmit(
                    id,
                    history,
                    patch,
                    patchEmployee,
                    "Освобождение изменено",
                    dispatch
                );
            }
        },
        [
            id,
            exemption,
            exemptionStartDate,
            exemptionEndDate,
            history,
            validate,
            dispatch,
        ]
    );

    const onChangeExemption = (e) => {
        const newExemptionLabel = e.target.value;

        const newExemption = exemptions.find(
            (ex) => ex.label === newExemptionLabel
        );

        setExemption(newExemption);
    };

    const onChangeExemptionStartDate = (newExemptionStartDate) => {
        setExemptionStartDate(newExemptionStartDate);

        if (exemption && exemption.name === "LESS_THAN_YEAR_WORK") {
            let newExemptionEndDate = newExemptionStartDate;
            newExemptionEndDate.setFullYear(
                newExemptionEndDate.getFullYear() + 1
            );
            setExemptionEndDate(newExemptionEndDate);
        }
    };

    const onChangeExemptionEndDate = (newExemptionEndDate) => {
        setExemptionEndDate(newExemptionEndDate);

        if (exemption && exemption.name === "LESS_THAN_YEAR_WORK") {
            let newExemptionStartDate = newExemptionEndDate;
            newExemptionStartDate.setFullYear(
                newExemptionStartDate.getFullYear() - 1
            );
            setExemptionStartDate(newExemptionStartDate);
        }
    };

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    if (!exemptionIsLoaded || !exemptionsIsLoaded) {
        return <Spinner />;
    }

    return (
        <div className="Form">
            <Card className="card">
                <CardContent className="card-content">
                    <div className="card-label">
                        <span className="header-label">
                            Изменить освобождение
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
                            <MyTextField
                                error={errors.exemption.length > 0}
                                helperText={errors.exemption}
                                select
                                value={exemption ? exemption.label : ""}
                                label="Причина"
                                onChange={onChangeExemption}
                                onBlur={() => {
                                    if (errors.exemption.length > 0) validate();
                                }}
                            >
                                {exemptions.map((type) => {
                                    return (
                                        <MenuItem
                                            key={type.name}
                                            value={type.label}
                                        >
                                            {type.label}
                                        </MenuItem>
                                    );
                                })}
                            </MyTextField>
                        </div>

                        <div className="input text-field">
                            <MyDatePicker
                                error={errors.exemptionStartDate.length > 0}
                                helperText={errors.exemptionStartDate}
                                label="Дата начала"
                                value={exemptionStartDate}
                                onChange={onChangeExemptionStartDate}
                                validate={validate}
                            />
                        </div>

                        <div className="input text-field">
                            <MyDatePicker
                                error={errors.exemptionEndDate.length > 0}
                                helperText={errors.exemptionEndDate}
                                label="Дата окончания"
                                value={exemptionEndDate}
                                onChange={onChangeExemptionEndDate}
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

export default EditExemptionPage;
