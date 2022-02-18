import { FalseObjectChecker as isFalseObject } from "../helpers/FalseObjectChecker";
import validator from "validator";

export const softValidate = (date) => {
    return isFalseObject(date) || validator.isDate(date)
        ? ""
        : "Неверный формат даты";
};
