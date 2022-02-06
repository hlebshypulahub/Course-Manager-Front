import React from "react";
import { Card, CardContent, CardActions } from "@mui/material";
import { banana_color, red } from "../helpers/color";
import Button from "@mui/material/Button";
import AirplanemodeInactiveIcon from "@mui/icons-material/AirplanemodeInactive";

import "../css/OkAlert.scss";

const OkAlert = (props) => {
    return (
        <div className="OkAlert">
            <Card
                className="card"
                style={{
                    backgroundColor: banana_color,
                }}
            >
                <CardContent className="card-content">
                    <div className="card-label">
                        <span className="header-label">{props.message}</span>
                    </div>
                </CardContent>
                <CardActions>
                    <div className="buttons">
                        <Button
                            variant="contained"
                            endIcon={<AirplanemodeInactiveIcon />}
                            style={{
                                backgroundColor: red,
                                color: "white",
                                fontWeight: "bold",
                                height: "40px",
                            }}
                            onClick={props.func}
                        >
                            OK
                        </Button>
                    </div>
                </CardActions>
            </Card>
        </div>
    );
};

export default OkAlert;
