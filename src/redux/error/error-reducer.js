import { SET_ERROR, CLEAR_ERROR } from "./error-types";

const initialState = {
    message: "",
    showModal: false,
};

export default function reducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_ERROR:
            return {
                ...state,
                message: payload.message,
                showModal: payload.showModal,
            };

        case CLEAR_ERROR:
            return {
                ...state,
                message: "",
                showModal: false,
            };

        default:
            return state;
    }
}
