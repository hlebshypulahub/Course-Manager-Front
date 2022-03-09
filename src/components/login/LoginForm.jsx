//// React
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

//// Functions
import { login } from "../../actions/auth";

//// Mui
import { TextField, Button } from "@mui/material";

//// CSS
import "./LoginForm.scss";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { isLoggedIn } = useSelector((state) => state.auth);
    const { message } = useSelector((state) => state.message);

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

                <Button
                    type="submit"
                    className="button"
                    variant="contained"
                    color="success"
                    style={{
                        fontFamily: "'Roboto', sans-serif",
                        color: "white",
                        fontWeight: "600",
                    }}
                >
                    Войти
                </Button>
            </form>
        </div>
    );
};

export default LoginForm;
