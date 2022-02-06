import authHeader from "./auth-header";
import { API_BASE_URL as baseUrl } from "./api.base.url";

const API_BASE_URL = baseUrl + "/api/v1/employees";

export const getEmployees = () => {
    return get(API_BASE_URL);
};

export const getEmployeesForCoursePlan = () => {
    return get(API_BASE_URL + "/for-course-plan");
};

const get = (url) => {
    return fetch(url, {
        method: "GET",
        headers: Object.assign(
            {},
            { "Content-type": "application/json" },
            authHeader()
        ),
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.status, response.message);
        }
    });
};

export const getEmployeeById = (id) => {
    return fetch(API_BASE_URL + "/" + id, {
        method: "GET",
        headers: Object.assign(
            {},
            { "Content-type": "application/json" },
            authHeader()
        ),
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error();
        }
    });
};

export const patchEmployeeCategory = (id, patch) => {
    return patchEmployee(id, patch, "/category");
};

export const patchEmployeeCategoryAssignmentDeadlineDate = (id, patch) => {
    return patchEmployee(id, patch, "/category-deadline");
};

export const patchEmployeeActive = (id, patch) => {
    return patchEmployee(id, patch, "/active");
};

export const patchEmployeeExemption = (id, patch) => {
    return patchEmployee(id, patch, "/exemption");
};

export const patchEmployeeEducation = (id, patch) => {
    return patchEmployee(id, patch, "/education");
};

const patchEmployee = (id, patch, path) => {
    return fetch(API_BASE_URL + "/" + id + path, {
        method: "PATCH",
        body: JSON.stringify(patch),
        headers: Object.assign(
            {},
            { "Content-type": "application/merge-patch+json" },
            authHeader()
        ),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.clone().json());
            }
        })
        .catch((error) => {
            console.log(error);
        });
};
