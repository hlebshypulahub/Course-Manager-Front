import notFoundImg from "../../img/not_found.jpg";

import "./NotFound.scss";

const NotFoundPage = (props) => {
    return (
        <div className="NotFound">
            <div className="not-found-img">
                <img src={notFoundImg} alt="Not Found" />
            </div>
        </div>
    );
};

export default NotFoundPage;
