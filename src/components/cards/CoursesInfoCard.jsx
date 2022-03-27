//// React
import { useHistory } from "react-router-dom";

//// Mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

//// Utils
import { pink, white } from "../../helpers/color";

const CoursesInfoCard = ({
    employee: { id, courseHoursLeft, categoryAssignmentDeadlineDate },
}) => {
    const history = useHistory();

    return (
        <Card className="card">
            <CardContent
                className="card-content"
                style={{
                    backgroundColor: pink,
                }}
            >
                <div className="course-hours">
                    <span>
                        {courseHoursLeft == null ? "-" : courseHoursLeft}
                    </span>
                </div>

                <div className="course-label">
                    <span>Необходимый объем часов</span>
                </div>

                <div className="course-date-label">
                    <span>
                        {categoryAssignmentDeadlineDate &&
                            "до " + categoryAssignmentDeadlineDate}
                    </span>
                </div>

                <div className="add-course-btn">
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        style={{
                            backgroundColor: white,
                            color: "black",
                            fontWeight: "bold",
                            height: "50px",
                            width: "200px",
                        }}
                        onClick={() => {
                            history.push(`/employees/${id}/add-course`);
                        }}
                    >
                        Добавить курс
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CoursesInfoCard;
