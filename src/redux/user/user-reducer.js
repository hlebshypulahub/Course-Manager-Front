import { LOGIN_SUCCESS, LOGIN_FAIL, EDIT_USER } from "./user-types";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
    ? { isLoggedIn: true, user }
    : { isLoggedIn: false, user: null };

export default function reducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: payload,
            };

        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
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
