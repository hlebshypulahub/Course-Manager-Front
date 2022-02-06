import authHeader from "./auth-header";
import { API_BASE_URL as baseUrl } from "./api.base.url";

const API_BASE_URL = baseUrl + "/api/user/";

export const getPublicContent = () => {
    return fetch(API_BASE_URL + "all");
};

export const getUserBoard = () => {
    return fetch(API_BASE_URL + "user", { headers: authHeader() });
};

export const getAdminBoard = () => {
    return fetch(API_BASE_URL + "admin", { headers: authHeader() });
};
