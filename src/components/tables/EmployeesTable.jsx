import React from "react";
import { useHistory } from "react-router";
import "./EmployeesTable.scss";
import moment from "moment";
import { DateParser as parse } from "../../helpers/DateParser";
import {
    employeeDefaultFilterValue as defaultFilterValue,
    scrollProps,
    i18n,
    defaultSortInfo,
} from "./TableProps";
import { EmployeeColumns } from "./TableColumns";

import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";

const EmployeesTable = ({ employees, tableLoading, setEmployeeId }) => {
    const employeeColumns = new EmployeeColumns(employees);

    const history = useHistory();

    window.moment = moment;

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

    const onRowClick = (rowProps, event) => {
        if (event.detail === 1) {
            setEmployeeId(rowProps.data.id);
        } else if (event.detail === 2) {
            history.push("/employees/" + rowProps.data.id);
        }
    };

    return (
        <div className="EmployeesTable">
            <div className="table">
                <ReactDataGrid
                    idProperty="name"
                    columns={employeeColumns.columns}
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
