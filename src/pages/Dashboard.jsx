import LoginPage from "./LoginPage";
import React from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import EmployeesPage from "./EmployeesPage";
import EmployeeView from "../components/EmployeeView";
import EditEducation from "../components/EditEducation";
import EditCategory from "../components/EditCategory";
import EditCategoryDeadline from "../components/EditCategoryDeadline";
import AddCourse from "../components/AddCourse";
import EditExemption from "../components/EditExemption";
import NotFound from "../components/NotFound";
import "../css/Dashboard.scss";
import Button from "@mui/material/Button";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useSelector } from "react-redux";

import { yellow } from "../helpers/color";

export const Dashboard = (props) => {
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
                <a href="/employees" style={{ textDecoration: "none" }}>
                    Course Manager
                </a>
                {currentUser && (
                    <div className="buttons">
                        <Button
                            variant="contained"
                            startIcon={<PeopleAltIcon />}
                            style={{
                                backgroundColor: yellow,
                                color: "black",
                                fontWeight: "bold",
                                height: "40px",
                            }}
                            onClick={toEmployeesPage}
                        >
                            Pracownicy
                        </Button>
                    </div>
                )}
            </header>

            <Switch>
                <Route exact path="/" component={EmployeesPage} />
                <Route path="/login" component={LoginPage} />
                <Route exact path="/employees" component={EmployeesPage} />
                <Route exact path="/employees/:id" component={EmployeeView} />
                <Route
                    path="/employees/:id/edit-edu"
                    component={EditEducation}
                />
                <Route
                    path="/employees/:id/edit-category"
                    component={EditCategory}
                />
                <Route path="/employees/:id/add-course" component={AddCourse} />
                <Route
                    path="/employees/:id/edit-category-deadline"
                    component={EditCategoryDeadline}
                />
                <Route
                    path="/employees/:id/edit-exemption"
                    component={EditExemption}
                />
                <Route component={NotFound} />
            </Switch>
        </div>
    );
};
