import authHeader from "./auth-header";
import { API_BASE_URL as baseUrl } from "./api.base.url";

const API_BASE_URL = baseUrl + "/api/v1/file";

export const uploadFile = (formData) => {
    return fetch(API_BASE_URL, {
        method: "POST",
        body: formData,
        headers: Object.assign({}, authHeader()),
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
