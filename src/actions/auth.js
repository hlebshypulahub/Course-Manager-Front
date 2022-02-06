import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, SET_MESSAGE } from "./types";

import AuthService from "../services/auth.service";

export const login = (username, password) => (dispatch) => {
    return AuthService.login(username, password)
        .then((data) => {
            if (data.accessToken) {
                localStorage.setItem("user", JSON.stringify(data));
            }
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { user: data },
            });
        })
        .catch((error) => {
            if (error.message === "401") {
                const message = "Zła nazwa użytkownika lub hasło";

                localStorage.removeItem("user");

                dispatch({
                    type: LOGIN_FAIL,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: message,
                });
            }
        });
};

export const logout = () => (dispatch) => {
    AuthService.logout();

    dispatch({
        type: LOGOUT,
    });
};
