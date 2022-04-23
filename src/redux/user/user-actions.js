import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    EDIT_USER,
    LOGIN_FETCHING,
    USER_FETCHED,
} from "./user-types";

import { setError, clearError } from "../error/error-actions";

import {
    login as serviceLogin,
    getUserFromAPI as getUser,
} from "../../services/auth.service";

const loginSuccess = (user) => {
    return {
        type: LOGIN_SUCCESS,
        payload: user,
    };
};

const userFetched = (user) => {
    return {
        type: USER_FETCHED,
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

export const getUserFromAPI = (username) => (dispatch) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        dispatch(loginFetching());

        return getUser(username)
            .then((data) => {
                if (data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(data));

                    dispatch(userFetched(data));
                    dispatch(clearError());
                }
            })
            .catch((error) => {
                dispatch(setError(error.message));
            });
    }
};

export const login = (username, password) => (dispatch) => {
    dispatch(loginFetching());

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
