import { DateComparator as compare } from "../../helpers/DateComparator";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { dark_blue } from "../../helpers/color";

export class DependentProps {
    constructor(employees) {
        this.selectColumnPropsEnum = (property) => {
            return {
                filterEditor: SelectFilter,
                filterEditorProps: {
                    placeholder: "Все",
                    multiple: true,
                    wrapMultiple: false,
                    dataSource: [
                        ...new Set(
                            employees.map((e) =>
                                e[property] ? e[property].label : ""
                            )
                        ),
                    ].map((value) => {
                        return { key: value, id: value, label: value };
                    }),
                },
            };
        };

        this.selectColumnProps = (property) => {
            return {
                filterEditor: SelectFilter,
                multiple: true,
                wrapMultiple: false,
                filterEditorProps: {
                    placeholder: "Все",
                    dataSource: [
                        ...new Set(employees.map((e) => e[property])),
                    ].map((value) => ({ id: value, label: value })),
                },
            };
        };
    }
}

export const dateColumnProps = {
    sort: (v1, v2) => compare(v1, v2),
    dateFormat: "DD.MM.YYYY",
    filterEditor: DateFilter,
    filterEditorProps: (props, { index }) => {
        const op = props.filterValue.operator;
        let placeholder;
        if (op === "afterOrOn") {
            placeholder = "После (включительно)";
        } else if (op === "after") {
            placeholder = "После";
        } else if (op === "before") {
            placeholder = "До";
        } else if (op === "beforeOrOn") {
            placeholder = "До (включительно)";
        } else if (op === "eq") {
            placeholder = "В дату";
        } else if (op === "neq") {
            placeholder = "Исключить дату";
        } else if (op === "inrange") {
            placeholder = index === 1 ? "До" : "После";
        } else if (op === "notinrange") {
            placeholder = index === 1 ? "До" : "После";
        }
        return {
            dateFormat: "DD.MM.YYYY",
            placeholder,
        };
    },
    render: ({ value, cellProps: { dateFormat } }) => {
        return value ? moment(value).format(dateFormat) : "";
    },
};

export const defaultSortInfo = [
    { name: "fullName", dir: 0 },
    { name: "hiringDate", dir: 0 },
    { name: "jobFacility", dir: 0 },
    { name: "position", dir: 0 },
    { name: "qualification", dir: 0 },
    { name: "category", dir: 0 },
    { name: "categoryNumber", dir: 0 },
    { name: "categoryAssignmentDate", dir: 0 },
    { name: "categoryAssignmentDeadlineDate", dir: 0 },
    { name: "docsSubmitDeadlineDate", dir: 0 },
    { name: "categoryPossiblePromotionDate", dir: 0 },
    { name: "courseHoursSum", dir: 0 },
    { name: "courseHoursLeft", dir: 0 },
    { name: "education", dir: 0 },
    { name: "eduName", dir: 0 },
    { name: "eduGraduationDate", dir: 0 },
];

export const dateFilterProps = {
    operator: "after",
    type: "date",
    value: "",
};

export const stringFilterProps = {
    operator: "startsWith",
    type: "string",
    value: "",
};

export const selectFilterProps = {
    operator: "inlist",
    type: "select",
    value: "",
};

export const numberFilterProps = {
    operator: "gte",
    type: "number",
    value: 0,
};

export const scrollProps = Object.assign(
    {},
    ReactDataGrid.defaultProps.scrollProps,
    {
        scrollThumbStyle: {
            background: dark_blue,
        },
    }
);

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

export const i18n = Object.assign({}, ReactDataGrid.defaultProps.i18n, {
    pageText: "Страница ",
    ofText: " из ",
    perPageText: "Строк на страницу",
    showingText: "Показано ",
    clearAll: "Очистить все",
    clear: "Очистить",
    showFilteringRow: " ",
    hideFilteringRow: " ",
    enable: "Включить",
    disable: "Выключить",
    sortAsc: "Сортировать по возрастающей",
    sortDesc: "Сортировать по убывающей",
    unsort: "Отменить сортировку",
    group: " ",
    ungroup: " ",
    lockStart: " ",
    lockEnd: " ",
    unlock: " ",
    columns: "Показать / Скрыть колонки",
    autoresizeThisColumn: " ",
    autoresizeAllColumns: " ",
    autoSizeToFit: " ",
    contains: "Содержит текст",
    startsWith: "Начинается с",
    endsWith: "Оканчивается на",
    notContains: "Не содержит текст",
    inlist: "Есть в списке",
    notinlist: "Нет в списке",
    neq: "Не совпадает",
    inrange: "В диапазоне",
    notinrange: "Не в диапазоне",
    eq: "Совпадает",
    notEmpty: "Не пусто",
    empty: "Пусто",
    lt: "Меньше чем",
    lte: "Меньше либо равно чем",
    gt: "Больше чем",
    gte: "Больше либо равно чем",
    before: "До",
    beforeOrOn: "До или в",
    afterOrOn: "После или в",
    after: "После",
    start: "Начало",
    end: "Конец",
    dragHeaderToGroup: " ",
    noRecords: "Нет записей",
    "calendar.todayButtonText": "Сегодня",
    "calendar.clearButtonText": "Очистить",
    "calendar.okButtonText": "Принять",
    "calendar.cancelButtonText": "Отменить",
});
