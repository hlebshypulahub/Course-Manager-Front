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
        : "Необходимо указать причину";
    tempErrors.exemptionStartDate = validator.isDate(exemptionStartDate)
        ? ""
        : "Необходимо указать дату начала";
    tempErrors.exemptionEndDate =
        validator.isDate(exemptionEndDate) || isFalseObject(exemptionEndDate)
            ? ""
            : "Необходимо указать дату окончания";

    return tempErrors;
};
