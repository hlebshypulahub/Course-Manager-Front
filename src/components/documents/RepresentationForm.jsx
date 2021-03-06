//// React
import { useState, useEffect, useCallback } from "react";

//// Components
import MyTextField from "../inputs/MyTextField";
import CustomTextField from "../inputs/CustomTextField";
import FormButtons from "../FormButtons";
import Spinner from "../spinner/Spinner";

//// Mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";

//// Utils
import { banana_color } from "../../helpers/color";

//// Functions
import { isFalseObject } from "../../helpers/is-false-object";

//// CSS
import "../../pages/edit-pages/Form.scss";

const RepresentationForm = ({
    employee,
    principalCompany: pC,
    categories,
    fetchDocument,
    fetching
}) => {
    const [principalCompany, setPrincipalCompany] = useState(pC);
    const [category, setCategory] = useState();
    const [reason, setReason] = useState("confirmation");
    const [qualification, setQualification] = useState(employee.qualification);
    const [overallWorkExperience, setOverallWorkExperience] = useState("");
    const [lastPositionWorkExperience, setLastPositionWorkExperience] =
        useState("");
    const [recommendation, setRecommendation] = useState("");
    const [showing, setShowing] = useState("");
    const [flaws, setFlaws] = useState("");

    useEffect(() => {
        if (
            employee.category &&
            employee.category.name === "NONE" &&
            categories
        ) {
            setCategory(categories.find((c) => c.name === "FIRST"));
            setReason("assignment");
        } else if (categories) {
            setCategory(employee.category);
        }
    }, [employee, employee.category, categories]);

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

            fetchDocument(e, documentDto, "representation");
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

    if (isFalseObject(category)) {
        return <Spinner />;
    }

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
                        <span className="header-label">??????????????????????????</span>
                    </div>

                    <form className="form" onSubmit={handleSubmit}>
                        <div className="text-field">
                            <MyTextField
                                disabled
                                label="?????????????????? ??????????????????"
                                value={employee.position}
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="??????????????????????, ???????????????????????????? ??????????????????????????????"
                                value={principalCompany}
                                onChange={(e) =>
                                    setPrincipalCompany(e.target.value)
                                }
                                multiline
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                disabled
                                label="??????"
                                value={employee.fullName}
                            />
                        </div>

                        <div className="combined-row">
                            <span
                                style={{ marginRight: "14px" }}
                                className="text1"
                            >
                                ??????
                            </span>

                            <div
                                style={{ marginRight: "14px" }}
                                className="input"
                            >
                                <CustomTextField
                                    select
                                    value={reason}
                                    label=""
                                    onChange={(e) => setReason(e.target.value)}
                                    width={"200px"}
                                >
                                    <MenuItem
                                        key={"confirmation"}
                                        value={"confirmation"}
                                    >
                                        {"??????????????????????????"}
                                    </MenuItem>

                                    <MenuItem
                                        key={"assignment"}
                                        value={"assignment"}
                                    >
                                        {"????????????????????"}
                                    </MenuItem>
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
                                ???????????????????????????????? ??????????????????
                            </span>
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="???? ????????????????????????"
                                value={qualification}
                                onChange={(e) =>
                                    setQualification(e.target.value)
                                }
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="?????????? ???????? ????????????"
                                value={overallWorkExperience}
                                onChange={(e) =>
                                    setOverallWorkExperience(e.target.value)
                                }
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="???????? ???????????? ?? ?????????????????? ?????????????????? ??????????????????"
                                value={lastPositionWorkExperience}
                                onChange={(e) =>
                                    setLastPositionWorkExperience(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="?? ???????????? ???????? ????????????????????????????(??)"
                                value={recommendation}
                                onChange={(e) =>
                                    setRecommendation(e.target.value)
                                }
                                multiline
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="???????????????????? ???????????????????????? ???? ???????????????????????????? ????????????, ????????????????????"
                                value={showing}
                                onChange={(e) => setShowing(e.target.value)}
                                multiline
                            />
                        </div>

                        <div className="text-field">
                            <MyTextField
                                label="???????????????????? ?? ????????????, ???????????????????????????? ??????????????????, ???????????????????????? ????????????"
                                value={flaws}
                                onChange={(e) => setFlaws(e.target.value)}
                                multiline
                            />
                        </div>

                        <div className="buttons">
                            <FormButtons
                                onlySubmit={true}
                                submitting={fetching}
                            />
                        </div>
                    </form>
                </CardContent>{" "}
            </Card>
        </div>
    );
};

export default RepresentationForm;
