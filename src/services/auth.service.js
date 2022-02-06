import { API_BASE_URL as baseUrl } from "./api.base.url";

const API_BASE_URL = baseUrl + "/api/v1/auth";

const login = (username, password) => {
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

const logout = () => {
    localStorage.removeItem("user");
};

const exportedObject = {
    login,
    logout,
};

export default exportedObject;
