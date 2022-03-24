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
import { tableColor } from "../../helpers/color";

export class EmployeeColumns {
    constructor(employees) {
        this.dependentProps = new DependentProps(employees);

        this.columns = [
            {
                name: "colorGroup",
                header: "Группа",
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
                            background += `,${colors[i]} ${percentage}%`;
                        }
                        background += ")";

                        cellProps.style.background = background;
                    } else if (size === 1) {
                        cellProps.style.background = colors[0];
                    }
                },
            },
            {
                name: "fullName",
                header: "ФИО",
                defaultFlex: 1,
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
                defaultFlex: 1,
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
                header: "Срок подтверждения категории",
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
                header: "Необходимый объем (оставшийся)",
                type: "number",
                defaultVisible: false,
                defaultFlex: 1,
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
        color: tableColor.yellow,
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

export const courseColumns = [
    { name: "name", header: "Название", defaultFlex: 1 },
    {
        name: "description",
        header: "Описание",
        defaultFlex: 1,
        ...everyColumnProps,
    },
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
    { name: "fullName", ...stringFilterProps },
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
