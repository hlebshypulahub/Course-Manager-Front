import { API_BASE_URL as baseUrl } from "./api-base-url";
import authHeader from "./auth-header";

const API_BASE_URL = baseUrl + "/api/v1/auth";

export const login = (username, password) => {
    return fetch(API_BASE_URL + "/signin", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    }).then((response) => {
        if (response.ok) {
            return response.json().then((data) => {
                if (data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(data));
                }

                return data;
            });
        } else {
            throw new Error(response.status);
        }
    });
};

export const edit = (patch) => {
    return fetch(API_BASE_URL + "/edit", {
        method: "POST",
        body: JSON.stringify(patch),
        headers: Object.assign(
            {},
            { "Content-type": "application/json" },
            authHeader()
        ),
    }).then((response) => {
        if (response.ok) {
            return response.json().then((data) => {
                let user = JSON.parse(localStorage.getItem("user"));
                user = { ...user, company: data.company, email: data.email };

                localStorage.setItem("user", JSON.stringify(user));

                return data;
            });
        } else {
            throw new Error(response.status);
        }
    });
};

export const logout = () => {
    localStorage.removeItem("user");
};
