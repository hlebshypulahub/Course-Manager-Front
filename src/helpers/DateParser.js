export const DateParser = (dateString) => {
    if (
        typeof dateString === "undefined" ||
        dateString == null ||
        dateString === ""
    ) {
        return null;
    }

    var dateParts = dateString.split(".");

    return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
};
