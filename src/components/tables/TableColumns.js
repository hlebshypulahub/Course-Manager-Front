import {
    dateColumnProps,
    dateFilterProps,
    stringFilterProps,
    numberFilterProps,
    selectFilterProps,
    DependentProps,
    everyColumnProps,
} from "./TableProps";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import Button from "@inovua/reactdatagrid-community/packages/Button";
import { tableColor } from "../../helpers/color";
import Checkbox from "@mui/material/Checkbox";
import { deleteCourseFromEmployee } from "../../services/course.service";

export class EmployeeColumns {
    constructor(
        employees,
        coursePlan,
        addEmployeeToCoursePlan,
        isEmployeeChecked
    ) {
        this.dependentProps = new DependentProps(employees);

        let coursePlanColumns = [];
        if (coursePlan) {
            coursePlanColumns = [
                {
                    name: "halfYear1",
                    header: "I полугодие",
                    defaultFlex: 0.65,
                    ...everyColumnProps,
                    render: (data) => {
                        const employeeId = data.data.id;
                        return (
                            <div style={{ display: "table", margin: "0 auto" }}>
                                <Checkbox
                                    checked={isEmployeeChecked(employeeId, 1)}
                                    onChange={(e) =>
                                        addEmployeeToCoursePlan(
                                            employeeId,
                                            1,
                                            e.target.checked
                                        )
                                    }
                                    inputProps={{ "aria-label": "controlled" }}
                                />
                            </div>
                        );
                    },
                },
                {
                    name: "halfYear2",
                    header: "II полугодие",
                    defaultFlex: 0.65,
                    ...everyColumnProps,
                    render: (data) => {
                        const employeeId = data.data.id;
                        return (
                            <div style={{ display: "table", margin: "0 auto" }}>
                                <Checkbox
                                    checked={isEmployeeChecked(employeeId, 2)}
                                    onChange={(e) =>
                                        addEmployeeToCoursePlan(
                                            employeeId,
                                            2,
                                            e.target.checked
                                        )
                                    }
                                    inputProps={{ "aria-label": "controlled" }}
                                />
                            </div>
                        );
                    },
                },
            ];
        }

        this.columns = [
            ...coursePlanColumns,
            {
                name: "colorGroup",
                header: "",
                defaultFlex: 0.35,
                ...everyColumnProps,
                render: () => {
                    "";
                },
                onRender: (cellProps, { data }) => {
                    const size = data.colorGroup.length;

                    const colors = data.colorGroup.map((g) => {
                        return legend.find((l) => l.name === g).color;
                    });

                    const percentage = 100 / size;

                    if (size > 1) {
                        let background = "linear-gradient(90deg";
                        for (let i = 0; i < size; i++) {
                            background += `,${colors[i]} ${percentage * i}%`;
                            background += `,${colors[i]} ${
                                percentage * (i + 1)
                            }%`;
                        }
                        background += ")";

                        cellProps.style.background = background;
                    } else if (size === 1) {
                        cellProps.style.background = colors[0];
                    }

                    cellProps.style.borderColor = "#fff";
                },
            },
            {
                name: "shortName",
                header: "ФИО",
                defaultFlex: 0.9,
                ...everyColumnProps,
            },
            {
                name: "hiringDate",
                header: "Дата приема на работу",
                defaultVisible: false,
                defaultFlex: 1,
                ...dateColumnProps,
                ...everyColumnProps,
            },
            {
                name: "jobFacility",
                header: "Место работы",
                defaultVisible: false,
                defaultFlex: 1,
                ...this.dependentProps.selectColumnProps("jobFacility"),
                ...everyColumnProps,
            },
            {
                name: "position",
                header: "Должность",
                defaultFlex: 1,
                ...this.dependentProps.selectColumnProps("position"),
                ...everyColumnProps,
            },
            {
                name: "qualification",
                header: "Квалификация",
                defaultFlex: 1,
                ...this.dependentProps.selectColumnProps("qualification"),
                ...everyColumnProps,
            },
            {
                name: "category",
                header: "Категория",
                defaultFlex: 0.5,
                ...this.dependentProps.selectColumnPropsEnum("category"),
                ...everyColumnProps,
            },
            {
                name: "categoryNumber",
                header: "Номер категории",
                defaultVisible: false,
                defaultFlex: 1,
                ...everyColumnProps,
            },
            {
                name: "categoryAssignmentDate",
                header: "Дата получения категории",
                defaultVisible: false,
                defaultFlex: 1,
                ...dateColumnProps,
                ...everyColumnProps,
            },
            {
                name: "categoryAssignmentDeadlineDate",
                header: "Срок аттестации",
                defaultFlex: 1,
                ...dateColumnProps,
                ...everyColumnProps,
            },
            {
                name: "courseDeadlineDate",
                header: "Срок прохож. курса",
                defaultFlex: 1,
                ...dateColumnProps,
                ...everyColumnProps,
            },
            {
                name: "docsSubmitDeadlineDate",
                header: "Срок подачи документов",
                defaultFlex: 1,
                ...dateColumnProps,
                ...everyColumnProps,
            },
            {
                name: "categoryPossiblePromotionDate",
                header: "Возможное повышение категории после",
                defaultVisible: false,
                defaultFlex: 1,
                ...dateColumnProps,
                ...everyColumnProps,
            },
            {
                name: "courseHoursSum",
                header: "Сумма часов на курсах",
                type: "number",
                defaultVisible: false,
                defaultFlex: 1,
                filterEditor: NumberFilter,
                ...everyColumnProps,
            },
            {
                name: "courseHoursLeft",
                header: "Необходимый объем",
                type: "number",
                defaultFlex: 0.65,
                filterEditor: NumberFilter,
                ...everyColumnProps,
            },
            {
                name: "education",
                header: "Образование",
                defaultVisible: false,
                defaultFlex: 1,
                ...this.dependentProps.selectColumnPropsEnum("education"),
                ...everyColumnProps,
            },
            {
                name: "eduName",
                header: "УО",
                defaultVisible: false,
                defaultFlex: 1,
                ...this.dependentProps.selectColumnProps("eduName"),
                ...everyColumnProps,
            },
            {
                name: "eduGraduationDate",
                header: "Дата окончания",
                defaultVisible: false,
                defaultFlex: 1,
                ...dateColumnProps,
                ...everyColumnProps,
            },
        ];
    }
}

export const legend = [
    {
        name: "lackOfData",
        color: tableColor.red,
        text: ["Информация не дополнена (образование, категория)"],
    },
    {
        name: "noCoursesOrCourseDateAndLackOfHours",
        color: tableColor.orange,
        text: [
            "Прошло более 3.5 лет после прохождения крайних\nкурсов и не набран необходимый объем часов",
            "Список курсов пуст",
        ],
    },
    {
        name: "docsDateOrEnoughHours",
        color: tableColor.blue,
        text: [
            "Менее 4-х месяцев до срока подачи документов",
            "Необходимый объем часов набран",
        ],
    },
    {
        name: "notificationToday",
        color: tableColor.green,
        text: ["Сегодня запланированно уведомление (см. заметки)"],
    },
    {
        name: "notActiveOrExemptioned",
        color: tableColor.grey,
        text: ["Освобожден", "Неактивный"],
    },
];

// export class CourseColumns {
//     constructor(fetchEmployee) {
//         this.columns = [
//             { name: "name", header: "Организация", defaultFlex: 3 },
//             {
//                 name: "hours",
//                 header: "Количество часов",
//                 defaultFlex: 1,
//                 filterEditor: NumberFilter,
//                 ...everyColumnProps,
//             },
//             {
//                 name: "startDate",
//                 header: "Дата начала",
//                 defaultFlex: 1,
//                 ...dateColumnProps,
//                 ...everyColumnProps,
//             },
//             {
//                 name: "endDate",
//                 header: "Дата окончания",
//                 defaultFlex: 1,
//                 ...dateColumnProps,
//                 ...everyColumnProps,
//             },
//             {
//                 name: "description",
//                 header: "Название курса",
//                 defaultFlex: 4,
//                 ...everyColumnProps,
//             },
//             {
//                 name: "action",
//                 header: "",
//                 defaultFlex: 1,
//                 ...everyColumnProps,
//                 render: ({ _, data }) => {
//                     const deleteCourse = () => {
//                         deleteCourseFromEmployee(data.id).then(() =>
//                             fetchEmployee()
//                         );
//                     };

//                     return (
//                         <div
//                             style={{
//                                 display: "inline-block",
//                                 textAlign: "center",
//                             }}
//                         >
//                             <Button
//                                 style={{ margin: "0 auto" }}
//                                 onClick={deleteCourse}
//                             >
//                                 Удалить
//                             </Button>
//                         </div>
//                     );
//                 },
//             },
//         ];
//     }
// }

export const courseColumns = [
    { name: "name", header: "Организация", defaultFlex: 3 },
    {
        name: "hours",
        header: "Количество часов",
        defaultFlex: 1,
        filterEditor: NumberFilter,
        ...everyColumnProps,
    },
    {
        name: "startDate",
        header: "Дата начала",
        defaultFlex: 1,
        ...dateColumnProps,
        ...everyColumnProps,
    },
    {
        name: "endDate",
        header: "Дата окончания",
        defaultFlex: 1,
        ...dateColumnProps,
        ...everyColumnProps,
    },
    {
        name: "description",
        header: "Название курса",
        defaultFlex: 4,
        ...everyColumnProps,
    },
    {
        name: "action",
        header: "",
        defaultFlex: 1,
        ...everyColumnProps,
        render: ({ _, data }) => {
            const deleteCourse = () => {
                deleteCourseFromEmployee(data.id);
            };

            return (
                <div style={{ display: "inline-block", textAlign: "center" }}>
                    <Button style={{ margin: "0 auto" }} onClick={deleteCourse}>
                        Удалить
                    </Button>
                </div>
            );
        },
    },
];

export const employeeDefaultFilterValue = [
    {
        name: "hiringDate",
        ...dateFilterProps,
    },
    {
        name: "categoryAssignmentDate",
        ...dateFilterProps,
    },
    {
        name: "categoryAssignmentDeadlineDate",
        ...dateFilterProps,
    },
    {
        name: "docsSubmitDeadlineDate",
        ...dateFilterProps,
    },
    {
        name: "categoryPossiblePromotionDate",
        ...dateFilterProps,
    },
    {
        name: "eduGraduationDate",
        ...dateFilterProps,
    },
    { name: "shortName", ...stringFilterProps },
    { name: "jobFacility", ...selectFilterProps },
    { name: "position", ...selectFilterProps },
    { name: "qualification", ...selectFilterProps },
    { name: "category", ...selectFilterProps },
    { name: "categoryNumber", ...stringFilterProps },
    { name: "courseHoursSum", ...numberFilterProps },
    { name: "courseHoursLeft", ...numberFilterProps },
    { name: "education", ...selectFilterProps },
    { name: "eduName", ...selectFilterProps },
];
