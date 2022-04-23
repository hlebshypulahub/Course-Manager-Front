import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    EDIT_USER,
    LOGIN_FETCHING,
    USER_FETCHED
} from "./user-types";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
    ? { isLoggedIn: true, user: null, fetching: false }
    : { isLoggedIn: false, user: null, fetching: false };

export default function reducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case LOGIN_SUCCESS:
        case USER_FETCHED:
            return {
                ...state,
                isLoggedIn: true,
                fetching: false,
                user: payload,
            };

        case LOGIN_FETCHING:
            return {
                ...state,
                fetching: true,
            };

        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                fetching: false,
                user: null,
            };

        case EDIT_USER:
            return {
                ...state,
                user: {
                    ...user,
                    company: payload.company,
                    email: payload.email,
                },
            };

        default:
            return state;
    }
}
