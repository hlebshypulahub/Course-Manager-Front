import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { login } from "../actions/auth";

import { TextField, Button } from "@mui/material";
import "../css/LoginForm.scss";

const LoginForm = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { isLoggedIn } = useSelector((state) => state.auth);
    const { message } = useSelector((state) => state.message);

    const dispatch = useDispatch();

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = useCallback(
        (e) => {
            e.preventDefault();

            if (!(username === "" || password === "")) {
                dispatch(login(username, password));
            }
        },
        [dispatch, username, password]
    );

    useEffect(() => {
        const listener = (event) => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                event.preventDefault();
                handleLogin(event);
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [handleLogin]);

    if (isLoggedIn) {
        return <Redirect to="/" />;
    }

    return (
        <div className="LoginForm">
            <h3 className="label">A U T O R Y Z A C J A</h3>
            {message && (
                <div className="error">
                    <span>{message}</span>
                </div>
            )}
            <form className="form" onSubmit={handleLogin}>
                <TextField
                    className="input"
                    id="outlined-basic"
                    label="Nazwa użytkownika"
                    variant="outlined"
                    onChange={onChangeUsername}
                />
                <TextField
                    className="input"
                    id="outlined-password-input"
                    label="Hasło"
                    type="password"
                    autoComplete="current-password"
                    onChange={onChangePassword}
                />
                <Button
                    type="submit"
                    className="button"
                    variant="contained"
                    color="success"
                >
                    Zaloguj
                </Button>
            </form>
        </div>
    );
};

export default LoginForm;
