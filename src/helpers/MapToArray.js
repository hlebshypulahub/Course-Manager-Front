export const MapToArray = (map) => {
    return Array.from(map).map(([, value]) => value);
};
