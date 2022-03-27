import { isFalseObject } from "./is-false-object";
import validator from "validator";

export const dateIsBlank = (date) => {
    return isFalseObject(date) || validator.isDate(date)
        ? ""
        : "Неверный формат даты";
};
