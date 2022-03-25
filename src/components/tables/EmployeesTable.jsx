//// React
import React from "react";
import { useHistory } from "react-router";
import moment from "moment";

//// CSS
import "./EmployeesTable.scss";

//// Functions
import { DateParser as parse } from "../../helpers/DateParser";
import {
    employeeDefaultFilterValue as defaultFilterValue,
    scrollProps,
    i18n,
    defaultSortInfo,
} from "./TableProps";
import { EmployeeColumns, legend } from "./TableColumns";

//// ReactDataGrid
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import Button from "@inovua/reactdatagrid-community/packages/Button";

const EmployeesTable = ({
    employees,
    tableLoading,
    setEmployeeId,
    showFilteredEmployees,
}) => {
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
            colorGroup,
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
                colorGroup,
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

    const legendBlock = (
        <div className="legend">
            {legend.map((l) => {
                return (
                    <div
                        key={l.name}
                        className="legend-unit"
                        onClick={() => showFilteredEmployees(l.name)}
                    >
                        <div
                            className="color-box"
                            style={{
                                background: l.color,
                            }}
                        ></div>
                        <div className="label">
                            {l.text.map((str) => {
                                return (
                                    <div key={str}>
                                        <div className="dot">●</div>
                                        <div className="text">{str}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const resetButton = (
        <Button
            onClick={() => window.location.reload(true)}
            style={{ marginLeft: 10 }}
        >
            Сбросить фильтры
        </Button>
    );

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

                <div className="settingsBtns">
                    <div>{resetButton}</div>
                </div>

                {legendBlock}
            </div>
        </div>
    );
};

export default EmployeesTable;
