import { setMessage, setError } from "../redux";

export const handleSubmit = (
    id,
    history,
    patch,
    fetchFunction,
    snackMessage,
    dispatch = () => {}
) => {
    fetchFunction(id, patch)
        .then(() => {
            dispatch(setMessage(snackMessage));
            history.push(`/employees/${id}`);
        })
        .catch(() => {
            dispatch(setError("Отсутствует соединение с сервером...", true));
        });
};
