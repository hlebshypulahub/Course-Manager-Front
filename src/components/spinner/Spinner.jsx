import GridLoader from "react-spinners/GridLoader";
import { green } from "../../helpers/color";
import "./Spinner.scss";

const Spinner = () => {
    return (
        <div className="Spinner">
            <GridLoader
                className="spin"
                color={green}
                loading={true}
                size={30}
            />
        </div>
    );
};

export default Spinner;
