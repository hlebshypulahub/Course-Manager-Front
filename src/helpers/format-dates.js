import { isFalseObject } from "./is-false-object";

export const formatDates = (date) => {
    if (typeof date === "undefined" || date == null || isFalseObject(date)) {
        return null;
    }

    return date.toLocaleDateString();
};
