import LoginForm from "../components/LoginForm";
import "../css/LoginPage.scss";
import staffImg from "../img/staff_bg.jpg";

const LoginPage = (props) => {
    return (
        <div className="LoginPage">
            <div className="container">
                <div className="login-form">
                    <LoginForm />
                </div>
                <div className="staff-img">
                    <img src={staffImg} alt="Staff" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
