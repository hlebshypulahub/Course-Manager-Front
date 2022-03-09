//// React
import React from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

//// Pages
import LoginPage from "../login/LoginPage";
import EmployeesPage from "../employees/EmployeesPage";
import EmployeeViewPage from "../employee/EmployeeViewPage";
import EditEducationPage from "../edit-pages/EditEducationPage";
import EditCategoryPage from "../edit-pages/EditCategoryPage";
import EditCategoryDeadlinePage from "../edit-pages/EditCategoryDeadlinePage";
import AddCoursePage from "../course/AddCoursePage";
import EditExemptionPage from "../edit-pages/EditExemptionPage";
import EmployeeDocumentsPage from "../documents/EmployeeDocumentsPage";
import NotFoundPage from "../not-found/NotFoundPage";
import EditNotePage from "../edit-pages/EditNotePage";
import EditProfilePage from "../edit-pages/EditProfilePage";

//// CSS
import "./Dashboard.scss";

//// Mui
import Button from "@mui/material/Button";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FaceIcon from "@mui/icons-material/Face";

//// Utils
import { yellow, cyan } from "../../helpers/color";

export const Dashboard = () => {
    const history = useHistory();
    const location = useLocation();
    const { user: currentUser } = useSelector((state) => state.auth);

    const toEmployeesPage = () => {
        if (location.pathname === "/employees") {
            window.location.reload();
        } else {
            history.push("/employees");
        }
    };

    return (
        <div className="Dashboard">
            <header>
                {currentUser && (
                    <>
                        <a href="/employees" style={{ textDecoration: "none" }}>
                            <span
                                style={{
                                    color: yellow,
                                    fontSize: "24px",
                                    fontFamily: "'Exo 2', sans-serif",
                                }}
                            >
                                {currentUser.company}
                            </span>
                        </a>

                        <div className="buttons">
                            <Button
                                variant="contained"
                                startIcon={<PeopleAltIcon />}
                                style={{
                                    backgroundColor: yellow,
                                    color: "black",
                                    fontWeight: "600",
                                    height: "40px",
                                }}
                                onClick={toEmployeesPage}
                            >
                                Сотрудники
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<FaceIcon />}
                                style={{
                                    marginLeft: "15px",
                                    backgroundColor: cyan,
                                    color: "black",
                                    fontWeight: "600",
                                    height: "40px",
                                }}
                                onClick={() => history.push("/edit-profile")}
                            >
                                Профиль
                            </Button>
                        </div>
                    </>
                )}
            </header>

            <Switch>
                <Route exact path="/" component={EmployeesPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/edit-profile" component={EditProfilePage} />
                <Route exact path="/employees" component={EmployeesPage} />
                <Route
                    exact
                    path="/employees/:id"
                    component={EmployeeViewPage}
                />
                <Route
                    path="/employees/:id/edit-edu"
                    component={EditEducationPage}
                />
                <Route
                    path="/employees/:id/edit-category"
                    component={EditCategoryPage}
                />
                <Route
                    path="/employees/:id/add-course"
                    component={AddCoursePage}
                />
                <Route
                    path="/employees/:id/edit-category-deadline"
                    component={EditCategoryDeadlinePage}
                />
                <Route
                    path="/employees/:id/edit-exemption"
                    component={EditExemptionPage}
                />
                <Route path="/employees/:id/note" component={EditNotePage} />
                <Route
                    path="/employees/:id/documents"
                    component={EmployeeDocumentsPage}
                />
                <Route component={NotFoundPage} />
            </Switch>
        </div>
    );
};
