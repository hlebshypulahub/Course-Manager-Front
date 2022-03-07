import React from "react";
import { useHistory } from "react-router";
import { DateComparator as compare } from "../helpers/DateComparator";
import "../css/EmployeesTable.scss";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import { DateParser as parse } from "../helpers/DateParser";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";

import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";

//// Utils
import { dark_blue } from "../helpers/color";

const EmployeesTable = ({ employees, tableLoading, setEmployeeId }) => {
    const history = useHistory();

    window.moment = moment;

    const dateColumnProps = {
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

    const selectColumnPropsEnum = (property) => {
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

    const selectColumnProps = (property) => {
        return {
            filterEditor: SelectFilter,
            multiple: true,
            wrapMultiple: false,
            filterEditorProps: {
                placeholder: "Все",
                dataSource: [...new Set(employees.map((e) => e[property]))].map(
                    (value) => ({ id: value, label: value })
                ),
            },
        };
    };

    const columns = [
        { name: "fullName", header: "ФИО", defaultFlex: 1 },
        {
            name: "hiringDate",
            header: "Дата приема на работу",
            defaultVisible: false,
            defaultFlex: 1,
            ...dateColumnProps,
        },
        {
            name: "jobFacility",
            header: "Место работы",
            defaultVisible: false,
            defaultFlex: 1,
            ...selectColumnProps("jobFacility"),
        },
        {
            name: "position",
            header: "Должность",
            defaultFlex: 1,
            ...selectColumnProps("position"),
        },
        {
            name: "qualification",
            header: "Квалификация",
            defaultFlex: 1,
            ...selectColumnProps("qualification"),
        },
        {
            name: "category",
            header: "Категория",
            defaultFlex: 1,
            ...selectColumnPropsEnum("category"),
        },
        {
            name: "categoryNumber",
            header: "Номер категории",
            defaultVisible: false,
            defaultFlex: 1,
        },
        {
            name: "categoryAssignmentDate",
            header: "Дата получения категории",
            defaultVisible: false,
            defaultFlex: 1,
            ...dateColumnProps,
        },
        {
            name: "categoryAssignmentDeadlineDate",
            header: "Срок подтверждения категории",
            defaultFlex: 1,
            ...dateColumnProps,
        },
        {
            name: "docsSubmitDeadlineDate",
            header: "Срок подачи документов",
            defaultFlex: 1,
            ...dateColumnProps,
        },
        {
            name: "categoryPossiblePromotionDate",
            header: "Возможное повышение категории после",
            defaultVisible: false,
            defaultFlex: 1,
            ...dateColumnProps,
        },
        {
            name: "courseHoursSum",
            header: "Сумма часов на курсах",
            type: "number",
            defaultVisible: false,
            defaultFlex: 1,
            filterEditor: NumberFilter,
        },
        {
            name: "courseHoursLeft",
            header: "Необходимый объем (оставшийся)",
            type: "number",
            defaultVisible: false,
            defaultFlex: 1,
            filterEditor: NumberFilter,
        },
        {
            name: "education",
            header: "Образование",
            defaultVisible: false,
            defaultFlex: 1,
            ...selectColumnPropsEnum("education"),
        },
        {
            name: "eduName",
            header: "УО",
            defaultVisible: false,
            defaultFlex: 1,
            ...selectColumnProps("eduName"),
        },
        {
            name: "eduGraduationDate",
            header: "Дата окончания",
            defaultVisible: false,
            defaultFlex: 1,
            ...dateColumnProps,
        },
    ];

    const rows = employees.map(
        ({
            id,
            fullName,
            hiringDate,
            jobFacility,
            position,
            qualification,
            category,
            categoryNumber,
            categoryAssignmentDate,
            categoryAssignmentDeadlineDate,
            docsSubmitDeadlineDate,
            categoryPossiblePromotionDate,
            courseHoursSum,
            courseHoursLeft,
            education,
            eduName,
            eduGraduationDate,
        }) => {
            return {
                id,
                fullName,
                hiringDate: parse(hiringDate),
                jobFacility,
                position,
                qualification,
                category: category ? category.label : "",
                categoryNumber,
                categoryAssignmentDate: parse(categoryAssignmentDate),
                categoryAssignmentDeadlineDate: parse(
                    categoryAssignmentDeadlineDate
                ),
                docsSubmitDeadlineDate: parse(docsSubmitDeadlineDate),
                categoryPossiblePromotionDate: parse(
                    categoryPossiblePromotionDate
                ),
                courseHoursSum,
                courseHoursLeft,
                education: education ? education.label : "",
                eduName,
                eduGraduationDate: parse(eduGraduationDate),
            };
        }
    );

    const defaultSortInfo = [
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

    const dateFilterProps = {
        operator: "after",
        type: "date",
        value: "",
    };

    const stringFilterProps = {
        operator: "startsWith",
        type: "string",
        value: "",
    };

    const selectFilterProps = {
        operator: "inlist",
        type: "select",
        value: "",
    };

    const numberFilterProps = {
        operator: "gte",
        type: "number",
        value: 0,
    };

    const defaultFilterValue = [
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

    const scrollProps = Object.assign(
        {},
        ReactDataGrid.defaultProps.scrollProps,
        {
            scrollThumbStyle: {
                background: dark_blue,
            },
        }
    );

    const onRowClick = (rowProps, event) => {
        if (event.detail === 1) {
            setEmployeeId(rowProps.data.id);
        } else if (event.detail === 2) {
            history.push("/employees/" + rowProps.data.id);
        }
    };

    const i18n = Object.assign({}, ReactDataGrid.defaultProps.i18n, {
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

    return (
        <div className="EmployeesTable">
            <div className="table">
                <ReactDataGrid
                    idProperty="name"
                    columns={columns}
                    dataSource={rows}
                    loading={tableLoading}
                    onRowClick={onRowClick}
                    defaultSortInfo={defaultSortInfo}
                    pagination
                    enableFiltering
                    defaultFilterValue={defaultFilterValue}
                    rowHeight={50}
                    scrollProps={scrollProps}
                    shareSpaceOnResize
                    i18n={i18n}
                />
            </div>
        </div>
    );
};

export default EmployeesTable;
