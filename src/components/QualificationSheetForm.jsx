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
import { MapToArray as mapToArray } from "../helpers/MapToArray";

import "../css/Form.scss";

const QualificationSheetForm = (props) => {
    const uuidv4 = require("uuid/v4");
    const employee = props.employee;
    const categories = props.categories;
    const [category, setCategory] = useState({});
    const [qualification, setQualification] = useState(
        props.employee.qualification
    );
    const [isDocumentLoading, setDocumentLoading] = useState(false);
    const [dob, setDob] = useState({});
    const [diplomaNumber, setDiplomaNumber] = useState("");
    const [diplomaQualification, setDiplomaQualification] = useState("");
    const [pastJobs, setPastJobs] = useState(
        new Map([
            [
                uuidv4(),
                {
                    pastJob: "",
                    startDate: null,
                    endDate: null,
                },
            ],
        ])
    );
    const [professionalTraining, setProfessionalTraining] = useState("");
    const [academicDegree, setAcademicDegree] = useState("");
    const [academicTitle, setAcademicTitle] = useState("");
    const [honoraryTitle, setHonoraryTitle] = useState("");
    const [language, setLanguage] = useState("");
    const [clubs, setClubs] = useState("");
    const [thesises, setThesises] = useState("");
    const [inventions, setInventions] = useState("");
    const [positionAndPrincipalCompany, setPositionAndPrincipalCompany] =
        useState("");

    const fetchDocument = useCallback(
        (e, documentDto) => {
            // console.log(pastJobs);
            // console.log(mapToArray(pastJobs));
            // console.log(JSON.stringify(mapToArray(pastJobs)));
            // console.log(documentDto);
            documentDto = { ...documentDto, pastJobs: mapToArray(pastJobs) };
            e.preventDefault();
            setDocumentLoading(true);
            getDocumentForEmployee(
                employee.id,
                documentDto,
                "qualification-sheet"
            )
                .then((data) => {
                    setDocumentLoading(false);
                })
                .catch((error) => {});
        },
        [employee.id, pastJobs]
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

    useEffect(() => {
        setPositionAndPrincipalCompany(
            employee.position + ", " + props.principalCompany
        );
    }, [employee.position, props.principalCompany]);

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
                startDate: format(newStartDate),
            });
            setPastJobs(tempPastJobs);
        } else {
            setPastJobs([
                ...pastJobs,
                [uuidv4(), { startDate: format(newStartDate) }],
            ]);
        }
    };

    const onChangeEndDate = (newEndDate, key) => {
        if (pastJobs.get(key)) {
            let tempPastJobs = new Map(pastJobs);
            tempPastJobs.set(key, {
                ...tempPastJobs.get(key),
                endDate: format(newEndDate),
            });
            setPastJobs(tempPastJobs);
        } else {
            setPastJobs([
                ...pastJobs,
                [uuidv4(), { endDate: format(newEndDate) }],
            ]);
        }
    };

    const extendPastJobs = () => {
        let tempPastJobs = new Map(pastJobs);
        tempPastJobs.set(uuidv4(), {
            pastJob: "",
            startDate: null,
            endDate: null,
        });
        setPastJobs(tempPastJobs);
    };

    const onChangeDiplomaNumber = (e) => {
        const newDiplomaNumber = e.target.value;
        setDiplomaNumber(newDiplomaNumber);
    };

    const onChangePositionAndPrincipalCompany = (e) => {
        const newPositionAndPrincipalCompany = e.target.value;
        setPositionAndPrincipalCompany(newPositionAndPrincipalCompany);
    };

    const onChangeClubs = (e) => {
        const newClubs = e.target.value;
        setClubs(newClubs);
    };

    const onChangeThesises = (e) => {
        const newThesises = e.target.value;
        setThesises(newThesises);
    };

    const onChangeInventions = (e) => {
        const newInventions = e.target.value;
        setInventions(newInventions);
    };

    const onChangeAcademicDegree = (e) => {
        const newAcademicDegree = e.target.value;
        setAcademicDegree(newAcademicDegree);
    };

    const onChangeAcademicTitle = (e) => {
        const newAcademicTitle = e.target.value;
        setAcademicTitle(newAcademicTitle);
    };

    const onChangeHonoraryTitle = (e) => {
        const newHonoraryTitle = e.target.value;
        setHonoraryTitle(newHonoraryTitle);
    };

    const onChangeLanguage = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
    };

    const onChangeProfessionalTraining = (e) => {
        const newProfessionalTraining = e.target.value;
        setProfessionalTraining(newProfessionalTraining);
    };

    const onChangeDiplomaQualification = (e) => {
        const newDiplomaQualification = e.target.value;
        setDiplomaQualification(newDiplomaQualification);
    };

    const onChangeDob = (newDob) => {
        setDob(newDob);
    };

    const onChangeQualification = (e) => {
        const newQualification = e.target.value;
        setQualification(newQualification);
    };

    const onChangeCategory = (e) => {
        const newCategoryQualificationSheetLabel = e.target.value;
        const newCategory = categories.find(
            (c) =>
                c.qualificationSheetLabel === newCategoryQualificationSheetLabel
        );
        setCategory(!isFalseObject(newCategory) ? newCategory : {});
    };

    const handleSubmit = useCallback(
        (e) => {
            const documentDto = {
                category: category.name,
                qualification,
                dob: format(dob),
                diplomaNumber,
                diplomaQualification,
                pastJobs,
                professionalTraining,
                academicDegree,
                academicTitle,
                honoraryTitle,
                language,
                clubs,
                thesises,
                inventions,
                positionAndPrincipalCompany,
            };

            fetchDocument(e, documentDto);
        },
        [
            fetchDocument,
            category,
            qualification,
            dob,
            diplomaNumber,
            diplomaQualification,
            pastJobs,
            professionalTraining,
            academicDegree,
            academicTitle,
            honoraryTitle,
            language,
            clubs,
            thesises,
            inventions,
            positionAndPrincipalCompany,
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
                                value={positionAndPrincipalCompany}
                                onChange={onChangePositionAndPrincipalCompany}
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

                        {Array.from(pastJobs).map(([key, value], index) => {
                            return (
                                <PastJobFields
                                    key={key}
                                    uniqueKey={key}
                                    pastJob={value.pastJob}
                                    startDate={parse(value.startDate)}
                                    endDate={parse(value.endDate)}
                                    onChangePastJob={onChangePastJob}
                                    onChangeStartDate={onChangeStartDate}
                                    onChangeEndDate={onChangeEndDate}
                                    isLast={index === pastJobs.size - 1}
                                    extend={extendPastJobs}
                                />
                            );
                        })}

                        <div className="text-field">
                            <MyTextField
                                label="9. Повышение квалификации, профессиональная подготовка (где, когда, продолжительность)"
                                value={professionalTraining}
                                onChange={onChangeProfessionalTraining}
                                multiline
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="10. Ученая степень"
                                value={academicDegree}
                                onChange={onChangeAcademicDegree}
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="11. Ученое звание"
                                value={academicTitle}
                                onChange={onChangeAcademicTitle}
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="12. Почетное звание"
                                value={honoraryTitle}
                                onChange={onChangeHonoraryTitle}
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="13. Знание языка"
                                value={language}
                                onChange={onChangeLanguage}
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="14. Участие в научных медицинских обществах"
                                value={clubs}
                                onChange={onChangeClubs}
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="15. Опубликовано работ"
                                value={thesises}
                                onChange={onChangeThesises}
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="Изобретения и др."
                                value={inventions}
                                onChange={onChangeInventions}
                            />
                        </div>

                        <div className="combined-row">
                            <span
                                style={{ marginRight: "14px" }}
                                className="text2"
                            >
                                16. Претендует на
                            </span>
                            <div
                                style={{ marginRight: "14px" }}
                                className="input"
                            >
                                <CustomTextField
                                    select
                                    value={
                                        category &&
                                        category.qualificationSheetLabel
                                            ? category.qualificationSheetLabel
                                            : ""
                                    }
                                    label=""
                                    onChange={onChangeCategory}
                                    width={"120px"}
                                >
                                    {categories.map((c) => {
                                        return (
                                            <MenuItem
                                                key={c.name}
                                                value={
                                                    c.qualificationSheetLabel
                                                }
                                            >
                                                {c.qualificationSheetLabel}
                                            </MenuItem>
                                        );
                                    })}
                                </CustomTextField>
                            </div>
                            <span
                                className="text2"
                                style={{ marginRight: "14px" }}
                            >
                                квал. категорию по квал-ции
                            </span>
                            <div className="input">
                                <CustomTextField
                                    value={qualification}
                                    label=""
                                    onChange={onChangeQualification}
                                    width={"220px"}
                                />
                            </div>
                        </div>

                        <div className="text-field">
                            <MyDatePicker
                                label="17. Дата присвоения (подтверждения) предыдущей квалификационной категории"
                                value={parse(
                                    props.employee.categoryAssignmentDate
                                )}
                                disabled
                                onChange={() => {}}
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
