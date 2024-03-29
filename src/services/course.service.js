import { API_BASE_URL as baseUrl } from "./api-base-url";
import { fetchData } from "./fetch.service";

const API_BASE_URL = baseUrl + "/api/v1/courses";

export const getEmployeeCourses = (employeeId) => {
    return fetchData(API_BASE_URL + "/for-employee/" + employeeId);
};

export const addCourseToEmployee = (employeeId, course) => {
    return fetchData(
        API_BASE_URL + "/for-employee/" + employeeId,
        "POST",
        JSON.stringify(course)
    );
};

export const deleteCourseFromEmployee = (courseId) => {
    return fetchData(API_BASE_URL + "/delete/" + courseId, "DELETE").then(() =>
        window.location.reload(false)
    );
};
