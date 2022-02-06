import { FalseObjectChecker as isFalseObject } from "./FalseObjectChecker";
import validator from "validator";

export const CategoryValidator = (
    qualification,
    category,
    categoryNumber,
    categoryAssignmentDate
) => {
    let tempErrors = {};
    tempErrors.qualification = qualification ? "" : "Należy podać kwalifikację";
    tempErrors.category = !isFalseObject(category)
        ? ""
        : "Należy podać kategorię";
    tempErrors.categoryNumber =
        !isFalseObject(category) && category.name !== "NONE"
            ? categoryNumber
                ? ""
                : "Należy podać numer kategorii"
            : "";
    tempErrors.categoryAssignmentDate =
        !isFalseObject(category) && category.name !== "NONE"
            ? validator.isDate(categoryAssignmentDate)
                ? ""
                : "Należy podać datę nadania kategorii"
            : "";

    return tempErrors;
};
