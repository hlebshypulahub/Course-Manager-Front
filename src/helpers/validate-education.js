import { isFalseObject } from "./is-false-object";
import validator from "validator";

export const validateEducation = (education, eduName, eduGraduationDate) => {
    let tempErrors = {};

    tempErrors.education = !isFalseObject(education)
        ? ""
        : "Необходимо указать уровень";
    tempErrors.eduName = eduName ? "" : "Необходимо указать название УЗ";
    tempErrors.eduGraduationDate = validator.isDate(eduGraduationDate)
        ? ""
        : "Необходимо указать дату окончания";

    return tempErrors;
};
