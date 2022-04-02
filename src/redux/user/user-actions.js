import { LOGIN_SUCCESS, LOGIN_FAIL, EDIT_USER, LOGIN_FETCHING } from "./user-types";

import { setError, clearError } from "../error/error-actions";

import { login as serviceLogin } from "../../services/auth.service";

const loginSuccess = (user) => {
    return {
        type: LOGIN_SUCCESS,
        payload: user,
    };
};

const loginFetching = () => {
    return {
        type: LOGIN_FETCHING,
    };
};

const loginFail = () => {
    return {
        type: LOGIN_FAIL,
    };
};

export const editUser = (patch) => {
    return {
        type: EDIT_USER,
        payload: patch,
    };
};

export const login = (username, password) => (dispatch) => {
    dispatch(loginFetching())

    return serviceLogin(username, password)
        .then((data) => {
            if (data.accessToken) {
                localStorage.setItem("user", JSON.stringify(data));

                dispatch(loginSuccess(data));
                dispatch(clearError());
            }
        })
        .catch((error) => {
            if (error.message === "401") {
                const message = "Неверное имя пользователя или пароль";
                dispatch(setError(message));

                localStorage.removeItem("user");

                dispatch(loginFail());
            }
        });
};

export const logout = () => (dispatch) => {};
