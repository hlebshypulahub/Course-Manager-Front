//// React
import { useState, useCallback } from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import validator from "validator";

//// Components
import MyTextField from "../../components/inputs/MyTextField";
import FormButtons from "../../components/FormButtons";
import MyModal from "../../components/modals/MyModal";

//// Mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//// Functions
import { arrayIsEmpty as isEmpty } from "../../helpers/array-is-empty";
import { edit } from "../../services/auth.service";
import { editUser, setMessage } from "../../redux";

//// CSS
import "./Form.scss";

const EditProfilePage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [email, setEmail] = useState(user.email);
    const [company, setCompany] = useState(user.company);
    const [errors, setErrors] = useState({
        email: "",
        company: "",
    });
    const [modalShown, setModalShown] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const dispatch = useDispatch();

    const { user: currentUser } = useSelector((state) => state.user);

    const history = useHistory();

    const validate = useCallback(() => {
        let tempErrors = {};
        tempErrors.email = validator.isEmail(email)
            ? ""
            : "Необходимо указать и-мейл";
        tempErrors.company = company
            ? ""
            : "Необходимо указать наименование индивидуального предпринимателя, организации";

        setErrors(tempErrors);

        return isEmpty(tempErrors);
    }, [company, email]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (validate()) {
                const patch = {
                    email,
                    company,
                };

                setSubmitting(true);

                edit(patch)
                    .then(() => {
                        dispatch(editUser(patch));
                        dispatch(setMessage("Профиль изменен"));
                        history.push(`/`);
                    })
                    .catch(() => {
                        setModalShown(true);
                    });
            }
        },
        [email, company, history, validate, dispatch]
    );

    if (!currentUser) {
        return <Redirect to="/login" />;
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
            {modal}{" "}
            <Card className="card">
                <CardContent className="card-content">
                    <div className="card-label">
                        <span className="header-label">Изменить профиль</span>
                    </div>

                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input text-field">
                            <MyTextField
                                error={errors.company.length > 0}
                                helperText={errors.company}
                                label="Индивидуальный предприниматель, организация"
                                value={company || ""}
                                onChange={(e) => setCompany(e.target.value)}
                                onBlur={() => {
                                    if (errors.company.length > 0) validate();
                                }}
                            />
                        </div>

                        <div className="input text-field">
                            <MyTextField
                                error={errors.email.length > 0}
                                helperText={errors.email}
                                label="И-мейл"
                                value={email || ""}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => {
                                    if (errors.email.length > 0) validate();
                                }}
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

export default EditProfilePage;
