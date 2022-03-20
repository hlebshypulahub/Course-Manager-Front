import { LOGIN_SUCCESS, LOGIN_FAIL, EDIT_USER } from "./userTypes";

import { setError, clearError } from "../error/errorActions";

import { login as serviceLogin } from "../../services/auth.service";

const loginSuccess = (user) => {
    return {
        type: LOGIN_SUCCESS,
        payload: user,
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
