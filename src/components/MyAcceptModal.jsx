import React from "react";
import { Card, CardContent, CardActions } from "@mui/material";
import { banana_color } from "../helpers/color";
import FormButtons from "./FormButtons";
import Modal from "@mui/material/Modal";

import "../css/MyModal.scss";

const MyAcceptModal = ({ submitFunc, cancelFunc, message }) => {
    return (
        <Modal
            hideBackdrop
            open
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
                        <form onSubmit={submitFunc ? submitFunc : () => {}}>
                            <div className="buttons">
                                <FormButtons
                                    acceptText="Да"
                                    cancelText="Нет"
                                    cancelFunc={cancelFunc}
                                />
                            </div>
                        </form>
                    </CardActions>
                </Card>
            </div>
        </Modal>
    );
};

export default MyAcceptModal;
