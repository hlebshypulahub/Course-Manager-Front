import authHeader from "./auth-header";
import { API_BASE_URL as baseUrl } from "./api.base.url";

const API_BASE_URL = baseUrl + "/api/v1/principal";

export const getPrincipalCompany = () => {
    return fetch(API_BASE_URL, {
        method: "GET",
        headers: Object.assign(
            {},
            { "Content-type": "text/plain" },
            authHeader()
        ),
    }).then((response) => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error();
        }
    });
};
