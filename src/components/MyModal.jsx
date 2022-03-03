import React from "react";
import { Card, CardContent, CardActions } from "@mui/material";
import { banana_color, red } from "../helpers/color";
import Button from "@mui/material/Button";
import AirplanemodeInactiveIcon from "@mui/icons-material/AirplanemodeInactive";
import Modal from "@mui/material/Modal";

import "../css/MyModal.scss";

const MyModal = ({ func, message }) => {
    return (
        <Modal
            hideBackdrop
            open
            onClose={func}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <div className="MyModal">
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
            </div>
        </Modal>
    );
};

export default MyModal;
