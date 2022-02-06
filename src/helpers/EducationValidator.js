import { FalseObjectChecker as isFalseObject } from "./FalseObjectChecker";
import validator from "validator";

export const EducationValidator = (education, eduName, eduGraduationDate) => {
    let tempErrors = {};
    tempErrors.education = !isFalseObject(education)
        ? ""
        : "Należy podać rodzaj wykształcenia";
    tempErrors.eduName = eduName ? "" : "Należy podać nazwę szkoły";
    tempErrors.eduGraduationDate = validator.isDate(eduGraduationDate)
        ? ""
        : "Należy podać datę ukończenia stodiów";

    return tempErrors;
};
