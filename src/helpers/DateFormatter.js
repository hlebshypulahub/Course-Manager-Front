export const DateFormatter = (date) => {
    if (typeof date === "undefined" || date == null) {
        return null;
    }

    return date.toLocaleDateString();
};
