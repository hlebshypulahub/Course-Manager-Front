export const convertMapToArray = (map) => {
    return Array.from(map).map(([, value]) => value);
};
