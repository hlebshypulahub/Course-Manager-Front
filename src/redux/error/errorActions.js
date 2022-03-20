import { SET_ERROR, CLEAR_ERROR } from "./errorTypes";

export const setError = (message, showModal = false) => {
    return {
        type: SET_ERROR,
        payload: { message, showModal },
    };
};

export const clearError = () => {
    return {
        type: CLEAR_ERROR,
    };
};
