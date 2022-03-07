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

export class EmployeeColumns {
    constructor(employees) {
        this.dependentProps = new DependentProps(employees);

        this.columns = [
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
