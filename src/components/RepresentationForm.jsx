import React, { useState, useEffect, useCallback } from "react";
import MyTextField from "./MyTextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { banana_color } from "../helpers/color";

import "../css/Form.scss";

const RepresentationForm = (props) => {
    const employee = props.employee;
    const [principalCompany, setPrincipalCompany] = useState(
        props.principalCompany
    );

    const onChangePrincipalCompany = (e) => {
        const newPrincipalCompany = e.target.value;
        setPrincipalCompany(newPrincipalCompany);
    };

    return (
        <div className="Form">
            <Card className="card">
                <CardContent
                    className="card-content"
                    style={{
                        backgroundColor: banana_color,
                    }}
                >
                    <div className="card-label">
                        <span className="header-label">
                            {props.documentName}
                        </span>
                    </div>
                    <form className="form" onSubmit={props.handleSubmit}>
                        <div className="input text-field">
                            <MyTextField
                                disabled
                                label="Должность"
                                value={employee.position}
                            />
                        </div>
                        <div className="input text-field">
                            <MyTextField
                                label="Организация, индивидуальный предприниматель"
                                value={principalCompany}
                                onChange={onChangePrincipalCompany}
                            />
                        </div>
                        <div className="input text-field">
                            <MyTextField
                                disabled
                                label="ФИО"
                                value={employee.fullName}
                            />
                        </div>
                        {/* <div className="input text-field">
                            <MyTextField
                                error={errors.exemption.length > 0}
                                helperText={errors.exemption}
                                select
                                value={exemption ? exemption.label : ""}
                                label="Причина"
                                onChange={onChangeExemption}
                            >
                                {exemptions.map((type) => {
                                    return (
                                        <MenuItem
                                            key={type.name}
                                            value={type.label}
                                        >
                                            {type.label}
                                        </MenuItem>
                                    );
                                })}
                            </MyTextField>
                        </div> */}
                        {/* <div className="input text-field">
                            <MyDatePicker
                                error={errors.exemptionStartDate.length > 0}
                                helperText={errors.exemptionStartDate.toString()}
                                label="Дата начала"
                                value={exemptionStartDate}
                                onChange={onChangeExemptionStartDate}
                            />
                        </div>
                        <div className="input text-field">
                            <MyDatePicker
                                error={errors.exemptionEndDate.length > 0}
                                helperText={errors.exemptionEndDate.toString()}
                                label="Дата окончания"
                                value={exemptionEndDate}
                                onChange={onChangeExemptionEndDate}
                            />
                        </div>
                        <div className="buttons">
                            <FormButtons />
                        </div> */}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RepresentationForm;
