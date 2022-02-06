export const FalseObjectChecker = (obj) => {
    return (
        obj == null ||
        obj === undefined ||
        (Object.keys(obj).length === 0 && obj.constructor === Object)
    );
};
