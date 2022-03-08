export const handleSubmit = (
    e,
    id,
    history,
    validate,
    patch,
    fetchFunction,
    setModalShown,
    snackMessage
) => {
    e.preventDefault();

    if (validate()) {
        fetchFunction(id, patch)
            .then(() => {
                history.push({
                    pathname: `/employees/${id}`,
                    state: {
                        snackMessage,
                    },
                });
            })
            .catch(() => {
                setModalShown(true);
            });
    }
};
