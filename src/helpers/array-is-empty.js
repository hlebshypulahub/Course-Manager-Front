export const arrayIsEmpty = (table) => {
    return Object.values(table).every((item) => item === "");
}