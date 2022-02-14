import React, { useState, useEffect, useCallback } from "react";
import MyTextField from "./MyTextField";
import CustomTextField from "./CustomTextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { banana_color } from "../helpers/color";
import MenuItem from "@mui/material/MenuItem";
import { FalseObjectChecker as isFalseObject } from "../helpers/FalseObjectChecker";
import FormButtons from "./FormButtons";
import Spinner from "../components/Spinner";
import {
    getEmployeeById,
    getDocumentForEmployee,
} from "../services/employee.service";
import MyDatePicker from "./MyDatePicker";
import validator from "validator";
import { DateParser as parse } from "../helpers/DateParser";
import { DateFormatter as format } from "../helpers/DateFormatter";

import "../css/Form.scss";

const QualificationSheetForm = (props) => {
    const employee = props.employee;
    const [principalCompany, setPrincipalCompany] = useState(
        props.principalCompany
    );
    const categories = props.categories;
    const [category, setCategory] = useState({});
    const [reason, setReason] = useState("confirmation");
    const [qualification, setQualification] = useState(
        props.employee.qualification
    );
    const [overallWorkExperience, setOverallWorkExperience] = useState("");
    const [lastPositionWorkExperience, setLastPositionWorkExperience] =
        useState("");
    const [recommendation, setRecommendation] = useState("");
    const [showing, setShowing] = useState("");
    const [flaws, setFlaws] = useState("");
    const [isDocumentLoading, setDocumentLoading] = useState(false);
    const [dob, setDob] = useState({});
    const [diplomaNumber, setDiplomaNumber] = useState("");
    const [diplomaQualification, setDiplomaQualification] = useState("");

    const fetchDocument = useCallback(
        (e, documentDto) => {
            e.preventDefault();
            setDocumentLoading(true);
            getDocumentForEmployee(
                employee.id,
                documentDto,
                "representation",
                employee.fullName.replace(" ", "_") + "_представление.pdf"
            )
                .then((data) => {
                    setDocumentLoading(false);
                })
                .catch((error) => {});
        },
        [employee.id, employee.fullName]
    );

    useEffect(() => {
        if (
            props.employee.category &&
            props.employee.category.name === "NONE" &&
            categories
        ) {
            setCategory(categories.find((c) => c.name === "FIRST"));
        } else if (categories) {
            setCategory(props.employee.category);
        }
    }, [props.employee, props.employee.category, categories]);

    const onChangeOverallWorkExperience = (e) => {
        const newOverallWorkExperience = e.target.value;
        setOverallWorkExperience(newOverallWorkExperience);
    };

    const onChangeDiplomaNumber = (e) => {
        const newDiplomaNumber = e.target.value;
        setDiplomaNumber(newDiplomaNumber);
    };

    const onChangeDiplomaQualification = (e) => {
        const newDiplomaQualification = e.target.value;
        setDiplomaQualification(newDiplomaQualification);
    };

    const onChangeDob = (newDob) => {
        // if (!newCategoryAssignmentDate) {
        //     setErrors({
        //         ...errors,
        //         categoryAssignmentDate: "Необходимо указать дату получения",
        //     });
        // }
        setDob(newDob);
    };

    const onChangeFlaws = (e) => {
        let newFlaws = e.target.value;
        if (newFlaws.length > 230) {
            newFlaws = newFlaws.slice(0, -1);
        }
        setFlaws(newFlaws);
    };

    const onChangeShowing = (e) => {
        let newShowing = e.target.value;
        if (newShowing.length > 240) {
            newShowing = newShowing.slice(0, -1);
        }
        setShowing(newShowing);
    };

    const onChangeRecommendation = (e) => {
        let newRecommendation = e.target.value;
        if (newRecommendation.length > 270) {
            newRecommendation = newRecommendation.slice(0, -1);
        }
        setRecommendation(newRecommendation);
    };

    const onChangeLastPositionWorkExperience = (e) => {
        const newLastPositionWorkExperience = e.target.value;
        setLastPositionWorkExperience(newLastPositionWorkExperience);
    };

    const onChangePrincipalCompany = (e) => {
        const newPrincipalCompany = e.target.value;
        setPrincipalCompany(newPrincipalCompany);
    };

    const onChangeQualification = (e) => {
        const newQualification = e.target.value;
        setQualification(newQualification);
    };

    const onChangeReason = (e) => {
        const newReason = e.target.value;
        if (newReason === "assignment") {
            setReason("assignment");
        } else if (newReason === "confirmation") {
            setReason("confirmation");
        }
    };

    const onChangeCategory = (e) => {
        const newCategoryRepresentationLabel = e.target.value;
        const newCategory = categories.find(
            (c) => c.representationLabel === newCategoryRepresentationLabel
        );
        setCategory(!isFalseObject(newCategory) ? newCategory : {});
    };

    const handleSubmit = useCallback(
        (e) => {
            const documentDto = {
                principalCompany,
                ...(reason === "assignment" && { categoryAssignment: true }),
                ...(reason === "confirmation" && {
                    categoryConfirmation: true,
                }),
                category: category.name,
                qualification,
                overallWorkExperience,
                lastPositionWorkExperience,
                recommendation,
                showing,
                flaws,
            };

            fetchDocument(e, documentDto);
        },
        [
            fetchDocument,
            principalCompany,
            reason,
            category,
            qualification,
            overallWorkExperience,
            lastPositionWorkExperience,
            recommendation,
            showing,
            flaws,
        ]
    );

    if (isDocumentLoading) {
        return <Spinner />;
    }

    return (
        <div className="Form">
            <Card className="card">
                {" "}
                <CardContent
                    className="card-content"
                    style={{
                        backgroundColor: banana_color,
                    }}
                >
                    <div className="card-label">
                        <span className="header-label">
                            Квалификационный лист
                        </span>
                    </div>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="text-field">
                            <MyTextField
                                disabled
                                label="1. ФИО"
                                value={employee.fullName}
                            />
                        </div>
                        <div className="text-field">
                            <MyTextField
                                label="2. Должность служащего, организация, индивидуальный предприниматель"
                                value={
                                    employee.position +
                                    ", " +
                                    props.principalCompany
                                }
                            />
                        </div>
                        <div className="text-field">
                            <MyDatePicker
                                label="3. Дата и год рождения"
                                value={dob}
                                onChange={onChangeDob}
                                error={
                                    !isFalseObject(dob) &&
                                    !validator.isDate(dob)
                                }
                                helperText={
                                    isFalseObject(dob) || validator.isDate(dob)
                                        ? ""
                                        : "Неверный формат даты"
                                }
                            />
                        </div>
                        <div className="text-field">
                            <MyDatePicker
                                label="4. Год окончания учреждения образования"
                                value={parse(employee.eduGraduationDate)}
                                disabled
                            />
                        </div>
                        <div className="text-field">
                            <MyTextField
                                label="5. Наименование учреждения образования"
                                value={employee.eduName}
                                disabled
                            />
                        </div>
                        <div className="text-field">
                            <MyTextField
                                label="6. Номер диплома"
                                value={diplomaNumber}
                                onChange={onChangeDiplomaNumber}
                            />
                        </div>
                        <div className="text-field">
                            <MyTextField
                                label="7. Квалификация по диплому"
                                value={diplomaQualification}
                                onChange={onChangeDiplomaQualification}
                            />
                        </div>

                        <div className="combined-row">
                            <span
                                style={{ marginRight: "14px" }}
                                className="text1"
                            >
                                Для
                            </span>
                            <div
                                style={{ marginRight: "20px" }}
                                className="input"
                            >
                                <CustomTextField
                                    select
                                    value={reason}
                                    label=""
                                    onChange={onChangeReason}
                                    width={"200px"}
                                >
                                    {" "}
                                    <MenuItem
                                        key={"confirmation"}
                                        value={"confirmation"}
                                    >
                                        {"Подтверждения"}
                                    </MenuItem>{" "}
                                    <MenuItem
                                        key={"assignment"}
                                        value={"assignment"}
                                    >
                                        {"Присвоения"}
                                    </MenuItem>{" "}
                                </CustomTextField>
                            </div>
                            <div
                                style={{ marginRight: "14px" }}
                                className="input"
                            >
                                <CustomTextField
                                    select
                                    value={category.representationLabel}
                                    label=""
                                    onChange={onChangeCategory}
                                    width={"170px"}
                                >
                                    {categories.map((c) => {
                                        return (
                                            <MenuItem
                                                key={c.name}
                                                value={c.representationLabel}
                                            >
                                                {c.representationLabel}
                                            </MenuItem>
                                        );
                                    })}
                                </CustomTextField>
                            </div>
                            <span className="text1">
                                квалификационной категории
                            </span>
                        </div>
                        <div className="text-field">
                            <MyTextField
                                label="По квалификации"
                                value={qualification}
                                onChange={onChangeQualification}
                            />
                        </div>
                        <div className="text-field">
                            <MyTextField
                                label="Общий стаж работы"
                                value={overallWorkExperience}
                                onChange={onChangeOverallWorkExperience}
                            />
                        </div>
                        <div className="text-field">
                            <MyTextField
                                label="Стаж работы в последней должности служащего"
                                value={lastPositionWorkExperience}
                                onChange={onChangeLastPositionWorkExperience}
                            />
                        </div>
                        <div className="text-field">
                            <MyTextField
                                label="В работе себя зарекомендовал(а)"
                                value={recommendation}
                                onChange={onChangeRecommendation}
                            />
                        </div>
                        <div className="text-field">
                            <MyTextField
                                label="Недостатки в работе, дисциплинарные взыскания, обоснованные жалобы"
                                value={showing}
                                onChange={onChangeShowing}
                            />
                        </div>
                        <div className="text-field">
                            <MyTextField
                                label="Недостатки в работе, дисциплинарные взыскания, обоснованные жалобы"
                                value={flaws}
                                onChange={onChangeFlaws}
                            />
                        </div>
                        <div className="buttons">
                            <FormButtons onlySubmit={true} />
                        </div>
                    </form>
                </CardContent>{" "}
            </Card>
        </div>
    );
};

export default QualificationSheetForm;
