import GridLoader from "react-spinners/GridLoader";

import { dark_blue } from "../helpers/color";

import "../css/Spinner.scss";

const Spinner = (props) => {
    return (
        <div className="Spinner">
            <GridLoader
                className="spin"
                color={dark_blue}
                loading={true}
                size={30}
            />
        </div>
    );
};

export default Spinner;
