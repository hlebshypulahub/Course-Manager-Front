import { isFalseObject } from "./is-false-object";
import validator from "validator";

export const validateCategory = (
    qualification,
    category,
    categoryNumber,
    categoryAssignmentDate
) => {
    let tempErrors = {};
    tempErrors.qualification = qualification ? "" : "Необходимо указать квалификацию";
    tempErrors.category = !isFalseObject(category)
        ? ""
        : "Необходимо указать категорию";
    tempErrors.categoryNumber =
        !isFalseObject(category) && category.name !== "NONE"
            ? categoryNumber
                ? ""
                : "Необходимо указать номер"
            : "";
    tempErrors.categoryAssignmentDate =
        !isFalseObject(category) && category.name !== "NONE"
            ? validator.isDate(categoryAssignmentDate)
                ? ""
                : "Необходимо указать дату получения"
            : "";

    return tempErrors;
};
