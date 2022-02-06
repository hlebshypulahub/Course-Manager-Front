import authHeader from "./auth-header";
import { API_BASE_URL as baseUrl } from "./api.base.url";

const API_BASE_URL = baseUrl + "/api/v1/education";

export const getEducations = () => {
    return fetch(API_BASE_URL, {
        method: "GET",
        headers: Object.assign(
            {},
            { "Content-type": "application/json" },
            authHeader()
        ),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status, response.message);
            }
        })
        .catch((error) => {
            console.log(error.status + " " + error.message);
        });
};
