import { FalseObjectChecker as isFalseObject } from "../helpers/FalseObjectChecker";

export const DateFormatter = (date) => {
    if (typeof date === "undefined" || date == null || isFalseObject(date)) {
        return null;
    }

    return date.toLocaleDateString();
};
