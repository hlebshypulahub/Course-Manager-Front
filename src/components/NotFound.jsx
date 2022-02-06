import notFoundImg from "../img/not_found.jpg";

import "../css/NotFound.scss";

const NotFound = (props) => {
    return (
        <div className="NotFound">
            <div className="not-found-img">
                <img src={notFoundImg} alt="Not Found" />
            </div>
        </div>
    );
};

export default NotFound;
