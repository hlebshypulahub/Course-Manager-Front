//// React
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

//// Functions
import { login } from "../../redux";

//// Mui
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";

//// CSS
import "./LoginForm.scss";

//// Utils
import { green } from "../../helpers/color";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { isLoggedIn, fetching } = useSelector((state) => state.user);
    const { message } = useSelector((state) => state.error);

    const dispatch = useDispatch();

    const handleLogin = useCallback(
        (e) => {
            e.preventDefault();

            if (username && password) {
                dispatch(login(username, password));
            }
        },
        [dispatch, username, password]
    );

    useEffect(() => {
        const listener = (e) => {
            if (e.code === "Enter" || e.code === "NumpadEnter") {
                e.preventDefault();
                handleLogin(e);
            }
        };

        document.addEventListener("keydown", listener);

        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [handleLogin]);

    const errorSpan = message && (
        <div className="error">
            <span>{message}</span>
        </div>
    );

    if (isLoggedIn) {
        return <Redirect to="/" />;
    }

    return (
        <div className="LoginForm">
            <h3 className="label">А В Т О Р И З А Ц И Я</h3>

            {errorSpan}

            <form className="form" onSubmit={handleLogin}>
                <TextField
                    className="input"
                    id="outlined-basic"
                    label="Имя пользователя"
                    variant="outlined"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                    className="input"
                    id="outlined-password-input"
                    label="Пароль"
                    type="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <LoadingButton
                    endIcon={<LoginIcon />}
                    type="submit"
                    className="button"
                    variant="contained"
                    loading={fetching}
                    loadingPosition="end"
                    style={{
                        background: green,
                        fontFamily: "'Roboto', sans-serif",
                        color: "white",
                        fontWeight: "600",
                    }}
                >
                    Войти
                </LoadingButton>
            </form>
        </div>
    );
};

export default LoginForm;
