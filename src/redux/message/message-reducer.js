import { SET_MESSAGE, CLEAR_MESSAGE } from "./message-types";

const initialState = {
    message: "",
};

export default function reducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_MESSAGE:
            return {
                ...state,
                message: payload,
            };

        case CLEAR_MESSAGE:
            return {
                ...state,
                message: "",
            };

        default:
            return state;
    }
}
