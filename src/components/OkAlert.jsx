import React from "react";
import { Card, CardContent, CardActions } from "@mui/material";
import { banana_color, red } from "../helpers/color";
import Button from "@mui/material/Button";
import AirplanemodeInactiveIcon from "@mui/icons-material/AirplanemodeInactive";
import Modal from "@mui/material/Modal";

import "../css/OkAlert.scss";

const OkAlert = ({ func, message }) => {
    // return (
    //     <div className="OkAlert">
    //         <Card
    //             className="card"
    //             style={{
    //                 backgroundColor: banana_color,
    //             }}
    //         >
    //             <CardContent className="card-content">
    //                 <div className="card-label">
    //                     <span className="header-label">{props.message}</span>
    //                 </div>
    //             </CardContent>
    //             <CardActions>
    //                 <div className="buttons">
    //                     <Button
    //                         variant="contained"
    //                         endIcon={<AirplanemodeInactiveIcon />}
    //                         style={{
    //                             backgroundColor: red,
    //                             color: "white",
    //                             fontWeight: "bold",
    //                             height: "40px",
    //                         }}
    //                         onClick={props.func}
    //                     >
    //                         Ок
    //                     </Button>
    //                 </div>
    //             </CardActions>
    //         </Card>
    //     </div>
    // );

    return (
        <div className="OkAlert">
            <Modal
                hideBackdrop
                open
                onClose={func}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Card
                    className="card"
                    style={{
                        backgroundColor: banana_color,
                    }}
                >
                    <CardContent className="card-content">
                        <div className="card-label">
                            <span className="header-label">{message}</span>
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
                                onClick={func}
                            >
                                Ок
                            </Button>
                        </div>
                    </CardActions>
                </Card>
            </Modal>
        </div>
    );
};

export default OkAlert;
