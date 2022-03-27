import { API_BASE_URL as baseUrl } from "./api-base-url";
import { fetchData } from "./fetch.service";

const API_BASE_URL = baseUrl + "/api/v1/education";

export const getEducations = () => {
    return fetchData(API_BASE_URL);
};
