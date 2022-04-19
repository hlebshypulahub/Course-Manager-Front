//// React
import { useState, useEffect, useCallback } from "react";
import validator from "validator";

//// Components
import MyTextField from "../inputs/MyTextField";
import MyTextField220 from "../inputs/MyTextField220";
import CustomTextField from "../inputs/CustomTextField";
import FormButtons from "../FormButtons";
import MyDatePicker from "../inputs/MyDatePicker";
import PastJobFields from "./PastJobFields";

//// Mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";

//// Utils
import { banana_color } from "../../helpers/color";

//// Functions
import { parseDates as parse } from "../../helpers/parse-dates";
import { isFalseObject } from "../../helpers/is-false-object";
import { formatDates as format } from "../../helpers/format-dates";
import { convertMapToArray as mapToArray } from "../../helpers/convert-map-to-array";

//// CSS
import "../../pages/edit-pages/Form.scss";

const QualificationSheetForm = ({ employee, categories, principalCompany, fetchDocument, fetching }) => {
    // const uuidv4 = require("uuid/v4");
    const { v4: uuidV4 } = require("uuid");

    const [category, setCategory] = useState({});
    const [qualification, setQualification] = useState(
        employee.qualification || ""
    );
    const [dob, setDob] = useState({});
    const [diplomaNumber, setDiplomaNumber] = useState("");
    const [diplomaQualification, setDiplomaQualification] = useState("");
    const [professionalTraining, setProfessionalTraining] = useState("");
    const [academicDegree, setAcademicDegree] = useState("");
    const [academicTitle, setAcademicTitle] = useState("");
    const [honoraryTitle, setHonoraryTitle] = useState("");
    const [language, setLanguage] = useState("");
    const [clubs, setClubs] = useState("");
    const [thesises, setThesises] = useState("");
    const [inventions, setInventions] = useState("");
    const [positionAndPrincipalCompany, setPositionAndPrincipalCompany] =
        useState(employee.position + ", " + principalCompany);
    const [pastJobs, setPastJobs] = useState(
        new Map([
            [
                uuidV4(),
                {
                    pastJob: "",
                    startDate: null,
                    endDate: null,
                },
            ],
        ])
    );

    const customMarginRight = { marginRight: "14px" };

    useEffect(() => {
        if (
            employee.category &&
            employee.category.name === "NONE" &&
            categories
        ) {
            setCategory(categories.find((c) => c.name === "FIRST"));
        } else if (categories) {
            setCategory(employee.category);
        }
    }, [employee, employee.category, categories]);

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
            setPastJobs([...pastJobs, [uuidV4(), { pastJob: newPastJob }]]);
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
                [uuidV4(), { startDate: format(newStartDate) }],
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
                [uuidV4(), { endDate: format(newEndDate) }],
            ]);
        }
    };

    const extendPastJobs = () => {
        let tempPastJobs = new Map(pastJobs);
        tempPastJobs.set(uuidV4(), {
            pastJob: "",
            startDate: null,
            endDate: null,
        });
        setPastJobs(tempPastJobs);
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
            let documentDto = {
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

            documentDto = { ...documentDto, pastJobs: mapToArray(pastJobs) };

            fetchDocument(e, documentDto, "qualification-sheet");
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
                                onChange={(e) =>
                                    setPositionAndPrincipalCompany(
                                        e.target.value
                                    )
                                }
                                multiline
                            />
                        </div>

                        <div className="text-field">
                            <MyDatePicker
                                label="3. Дата и год рождения"
                                value={dob}
                                onChange={(newDate) => setDob(newDate)}
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
                                onChange={(e) =>
                                    setDiplomaNumber(e.target.value)
                                }
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="7. Квалификация по диплому"
                                value={diplomaQualification}
                                onChange={(e) =>
                                    setDiplomaQualification(e.target.value)
                                }
                            />
                        </div>

                        <div className="combined-row">
                            <span style={customMarginRight} className="text1">
                                8. Работа по окончании учреждения образования:
                            </span>
                        </div>

                        {Array.from(pastJobs).map(
                            ([key, { pastJob, startDate, endDate }], index) => {
                                return (
                                    <PastJobFields
                                        key={key}
                                        uniqueKey={key}
                                        pastJob={pastJob}
                                        startDate={parse(startDate)}
                                        endDate={parse(endDate)}
                                        onChangePastJob={onChangePastJob}
                                        onChangeStartDate={onChangeStartDate}
                                        onChangeEndDate={onChangeEndDate}
                                        isLast={index === pastJobs.size - 1}
                                        extend={extendPastJobs}
                                        customMarginRight={customMarginRight}
                                    />
                                );
                            }
                        )}

                        <div className="text-field">
                            <MyTextField
                                label="9. Повышение квалификации, профессиональная подготовка (где, когда, продолжительность)"
                                value={professionalTraining}
                                onChange={(e) =>
                                    setProfessionalTraining(e.target.value)
                                }
                                multiline
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="10. Ученая степень"
                                value={academicDegree}
                                onChange={(e) =>
                                    setAcademicDegree(e.target.value)
                                }
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="11. Ученое звание"
                                value={academicTitle}
                                onChange={(e) =>
                                    setAcademicTitle(e.target.value)
                                }
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="12. Почетное звание"
                                value={honoraryTitle}
                                onChange={(e) =>
                                    setHonoraryTitle(e.target.value)
                                }
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="13. Знание языка"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="14. Участие в научных медицинских обществах"
                                value={clubs}
                                onChange={(e) => setClubs(e.target.value)}
                                multiline
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="15. Опубликовано работ"
                                value={thesises}
                                onChange={(e) => setThesises(e.target.value)}
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="Изобретения и др."
                                value={inventions}
                                onChange={(e) => setInventions(e.target.value)}
                                multiline
                            />
                        </div>

                        <div className="combined-row">
                            <span style={customMarginRight} className="text2">
                                16. Претендует на
                            </span>
                            <div style={customMarginRight} className="input">
                                <CustomTextField
                                    select
                                    value={
                                        category.qualificationSheetLabel || ""
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
                            <span className="text2" style={customMarginRight}>
                                квал. категорию по квал-ции
                            </span>
                            <div className="input">
                                <MyTextField220
                                    value={qualification}
                                    label=""
                                    onChange={(e) =>
                                        setQualification(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="text-field">
                            <MyDatePicker
                                label="17. Дата присвоения (подтверждения) предыдущей квалификационной категории"
                                value={parse(employee.categoryAssignmentDate)}
                                disabled
                                onChange={() => {}}
                            />
                        </div>

                        <div className="buttons">
                            <FormButtons
                                onlySubmit={true}
                                submitting={fetching}
                            />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default QualificationSheetForm;
