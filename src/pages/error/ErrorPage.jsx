import { useEffect } from "react";
import errorImg from "../../img/error.jpg";

import "./ErrorPage.scss";

const ErrorPage = (props) => {
    useEffect(() => (document.title = "Ошибка..."), []);

    return (
        <div className="ErrorPage">
            <div className="error-img">
                <img src={errorImg} alt="Error" />
            </div>
        </div>
    );
};

export default ErrorPage;
