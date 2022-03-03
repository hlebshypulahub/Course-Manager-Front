export const EmptyErrorTableChecker = (table) => {
    return Object.values(table).every((item) => item === "");
}