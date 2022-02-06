import { FalseObjectChecker as isFalseObject } from "./FalseObjectChecker";
import validator from "validator";

export const ExemptionValidator = (
    exemption,
    exemptionStartDate,
    exemptionEndDate
) => {
    let tempErrors = {};
    tempErrors.exemption = !isFalseObject(exemption)
        ? ""
        : "Należy podać przyczynę zwolnienia";
    tempErrors.exemptionStartDate = validator.isDate(exemptionStartDate)
        ? ""
        : "Należy podać datę początku zwolnienia";
    tempErrors.exemptionEndDate = "";

    return tempErrors;
};
