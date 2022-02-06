import React from "react";
import { Card, CardContent, CardActions } from "@mui/material";
import FormButtons from "./FormButtons";
import { banana_color } from "../helpers/color";

import "../css/MyAlert.scss";

const MyAlert = (props) => {
    return (
        <div className="MyAlert">
            <Card
                className="card"
                style={{
                    backgroundColor: banana_color,
                }}
            >
                <CardContent className="card-content">
                    <div className="card-label">
                        <span className="header-label">{props.question}</span>
                    </div>
                </CardContent>
                <CardActions>
                    <form
                        onSubmit={
                            props.submitFunc ? props.submitFunc : () => {}
                        }
                    >
                        <div className="buttons">
                            <FormButtons
                                acceptText="Tak"
                                cancelText="Nie"
                                cancelFunc={props.cancelFunc}
                            />
                        </div>
                    </form>
                </CardActions>
            </Card>
        </div>
    );
};

export default MyAlert;
