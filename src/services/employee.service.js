import authHeader from "./auth-header";
import { API_BASE_URL as baseUrl } from "./api.base.url";
import { fetchData } from "./fetch.service";

const API_BASE_URL = baseUrl + "/api/v1/employees";

export const getEmployees = () => {
    return fetchData(API_BASE_URL);
};

export const getEmployeesForCoursePlan = () => {
    return fetchData(API_BASE_URL + "/for-course-plan");
};

export const getDocumentForEmployee = (id, dto, documentType) => {
    let body = JSON.stringify(dto);
    body = body.replace('"Invalid Date"', "null");
    return fetch(API_BASE_URL + "/" + id + "/documents/" + documentType, {
        method: "POST",
        body,
        headers: Object.assign(
            {},
            { "Content-type": "application/json" },
            authHeader()
        ),
    }).then((response) => {
        if (response.ok) {
            response.blob().then((blob) => {
                let url = window.URL.createObjectURL(blob);
                let iframe = document.createElement("iframe");
                document.body.appendChild(iframe);
                iframe.style.display = "none";
                iframe.src = url;
                iframe.onload = function () {
                    setTimeout(function () {
                        iframe.focus();
                        iframe.contentWindow.print();
                    }, 1);
                };
            });
        } else {
            throw new Error();
        }
    });
};

export const getEmployeeById = (id) => {
    return fetchData(API_BASE_URL + "/" + id);
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

export const patchEmployeeNote = (id, patch) => {
    return patchEmployee(id, patch, "/note");
};

export const patchEmployeeEducation = (id, patch) => {
    return patchEmployee(id, patch, "/education");
};

const patchEmployee = (id, patch, path) => {
    return fetchData(
        API_BASE_URL + "/" + id + path,
        "POST",
        JSON.stringify(patch)
    );
};
