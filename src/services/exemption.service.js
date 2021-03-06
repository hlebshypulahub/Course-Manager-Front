import { API_BASE_URL as baseUrl } from "./api-base-url";
import { fetchData } from "./fetch.service";

const API_BASE_URL = baseUrl + "/api/v1/exemption";

export const getExemptions = () => {
    return fetchData(API_BASE_URL);
};
