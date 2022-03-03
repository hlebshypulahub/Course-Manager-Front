import authHeader from "./auth-header";

export const fetchData = (url, method = "GET", body = null) => {
    return fetch(url, {
        method,
        body,
        headers: Object.assign(
            {},
            { "Content-type": "application/json" },
            authHeader()
        ),
    }).then((response) => {
        if (!response.ok) {
            throw new Error(response.status, response.message);
        }

        return response.json();
    });
};
