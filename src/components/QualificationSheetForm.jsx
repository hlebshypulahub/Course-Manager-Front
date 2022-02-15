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
import PastJobFields from "./PastJobFields";

import "../css/Form.scss";

const QualificationSheetForm = (props) => {
    const uuidv4 = require("uuid/v4");
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
    const [pastJobs, setPastJobs] = useState(
        new Map([
            [
                uuidv4(),
                {
                    pastJob: "A",
                    startDate: new Date(2020, 5, 1),
                    endDate: new Date(2020, 6, 2),
                },
            ],
            [
                uuidv4(),
                {
                    pastJob: "B",
                    startDate: new Date(2020, 5, 3),
                    endDate: new Date(2020, 6, 4),
                },
            ],
            [
                uuidv4(),
                {
                    pastJob: "C",
                    startDate: new Date(2020, 5, 5),
                    endDate: new Date(2020, 6, 6),
                },
            ],
        ])
    );
    // const [startDates, setStartDates] = useState([
    //     new Map([
    //         [uuidv4(), new Date(2020, 5, 5)],
    //         [uuidv4(), new Date(2020, 5, 5)],
    //         [uuidv4(), new Date(2020, 5, 5)],
    //     ]),
    // ]);
    // const [endDates, setEndDates] = useState([
    //     new Map([
    //         [uuidv4(), new Date(2020, 6, 6)],
    //         [uuidv4(), new Date(2020, 6, 6)],
    //         [uuidv4(), new Date(2020, 6, 6)],
    //     ]),
    // ]);

    const fetchDocument = useCallback(
        (e, documentDto) => {
            e.preventDefault();
            setDocumentLoading(true);
            getDocumentForEmployee(
                employee.id,
                documentDto,
                "representation",
                employee.fullName.replace(" ", "_") +
                    "_квалификационный_лист.pdf"
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

    const onChangePastJob = (e, key) => {
        const newPastJob = e.target.value;
        if (pastJobs.get(key)) {
            let tempPastJobs = new Map(pastJobs);
            tempPastJobs.set(key, {
                ...tempPastJobs.get(key),
                pastJob: newPastJob,
            });
            setPastJobs(tempPastJobs);
        } else {
            setPastJobs([...pastJobs, [uuidv4(), { pastJob: newPastJob }]]);
        }
    };

    const onChangeStartDate = (newStartDate, key) => {
        if (pastJobs.get(key)) {
            let tempPastJobs = new Map(pastJobs);
            tempPastJobs.set(key, {
                ...tempPastJobs.get(key),
                startDate: newStartDate,
            });
            setPastJobs(tempPastJobs);
        } else {
            setPastJobs([...pastJobs, [uuidv4(), { startDate: newStartDate }]]);
        }
    };

    const onChangeEndDate = (newEndDate, key) => {
        if (pastJobs.get(key)) {
            let tempPastJobs = new Map(pastJobs);
            tempPastJobs.set(key, {
                ...tempPastJobs.get(key),
                endDate: newEndDate,
            });
            setPastJobs(tempPastJobs);
        } else {
            setPastJobs([...pastJobs, [uuidv4(), { endDate: newEndDate }]]);
        }
    };

    // const onChangeEndDate = (newEndDate, index) => {
    //     if (index < endDates.length) {
    //         let tempEndDates = [...endDates];
    //         tempEndDates[index] = newEndDate;
    //         setEndDates(tempEndDates);
    //     } else {
    //         setEndDates([...endDates, newEndDate]);
    //     }
    // };

    // const onChangePastJob = (e, index) => {
    //     const newPastJob = e.target.value;
    //     if (index < pastJobs.length) {
    //         let tempPastJobs = [...pastJobs];
    //         tempPastJobs[index] = newPastJob;
    //         setPastJobs(tempPastJobs);
    //     } else {
    //         setPastJobs([...pastJobs, newPastJob]);
    //     }
    // };

    // const onChangeStartDate = (newStartDate, index) => {
    //     if (index < startDates.length) {
    //         let tempStartDates = [...startDates];
    //         tempStartDates[index] = newStartDate;
    //         setStartDates(tempStartDates);
    //     } else {
    //         setStartDates([...startDates, newStartDate]);
    //     }
    // };

    // const onChangeEndDate = (newEndDate, index) => {
    //     if (index < endDates.length) {
    //         let tempEndDates = [...endDates];
    //         tempEndDates[index] = newEndDate;
    //         setEndDates(tempEndDates);
    //     } else {
    //         setEndDates([...endDates, newEndDate]);
    //     }
    // };

    const extendPastJobs = () => {
        setPastJobs([...pastJobs, {}]);
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
                                onChange={() => {}}
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
                                8. Работа по окончании учреждения образования:
                            </span>
                        </div>

                        {/* {pastJobs.map((job, index) => {
                            const key = uuidv4();
                            console.log(key);
                            return (
                                <PastJobFields
                                    key={key}
                                    index={index}
                                    pastJob={job}
                                    // startDate={startDates[index]}
                                    // endDate={endDates[index]}
                                    onChangePastJob={onChangePastJob}
                                    // onChangeStartDate={onChangeStartDate}
                                    // onChangeEndDate={onChangeEndDate}
                                    isLast={index === pastJobs.length - 1}
                                    extend={extendPastJobs}
                                />
                            );
                        })} */}

                        {Array.from(pastJobs).map(([key, value], index) => {
                            return (
                                <PastJobFields
                                    key={key}
                                    uniqueKey={key}
                                    //  index={index}
                                    pastJob={value.pastJob}
                                    startDate={value.startDate}
                                    endDate={value.endDate}
                                    onChangePastJob={onChangePastJob}
                                    onChangeStartDate={onChangeStartDate}
                                    onChangeEndDate={onChangeEndDate}
                                    isLast={index === pastJobs.length - 1}
                                    extend={extendPastJobs}
                                />
                            );
                        })}

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
