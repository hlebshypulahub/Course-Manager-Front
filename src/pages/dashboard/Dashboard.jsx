//// React

import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

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

//// Components
import MyModal from "../../components/modals/MyModal";

//// CSS
import "./Dashboard.scss";

//// Mui
import Button from "@mui/material/Button";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FaceIcon from "@mui/icons-material/Face";
import SnackBar from "../../components/SnackBar";

//// Functions
import { clearMessage, clearError } from "../../redux";

//// Utils
import { green, white, font_grey } from "../../helpers/color";
import snake from "../../img/snake.png";

export const Dashboard = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const { user: currentUser } = useSelector((state) => state.user);
    const { message: snackMessage } = useSelector((state) => state.message);
    const { showModal, message: modalMessage } = useSelector(
        (state) => state.error
    );

    const toEmployeesPage = () => {
        if (location.pathname === "/employees") {
            window.location.reload();
        } else {
            history.push("/employees");
        }
    };

    const snackBar = (
        <SnackBar
            open={!!snackMessage}
            message={snackMessage}
            handleClose={() => {
                dispatch(clearMessage());
            }}
        />
    );

    const modal = showModal && (
        <MyModal
            message={modalMessage}
            func={() => {
                dispatch(clearError());
            }}
        />
    );

    return (
        <div className="Dashboard">
            {snackBar}

            {modal}

            <header style={{ background: green }}>
                {currentUser && (
                    <>
                        <a href="/employees" style={{ textDecoration: "none" }}>
                            <span
                                style={{
                                    color: white,
                                    fontSize: "24px",
                                    fontFamily: "'Exo 2', sans-serif",
                                }}
                            >
                                {currentUser.company}
                            </span>
                            <span
                                style={{ marginLeft: "15px", marginTop: "5px" }}
                            >
                                <img src={snake} alt="Медицина"/>
                            </span>
                        </a>

                        <div className="buttons">
                            <Button
                                variant="contained"
                                startIcon={<PeopleAltIcon />}
                                style={{
                                    backgroundColor: white,
                                    color: font_grey,
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
                                    backgroundColor: white,
                                    color: font_grey,
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
