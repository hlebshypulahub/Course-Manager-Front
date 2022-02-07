import React from "react";
import { useHistory } from "react-router";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DateParser as parse } from "../helpers/DateParser";
import "../css/EmployeesTable.scss";

const EmployeesTable = (props) => {
    const employees = props.employees;

    const history = useHistory();

    const columns = [
        { field: "fullName", headerName: "ФИО", width: 250 },
        {
            field: "hiringDate",
            headerName: "Дата приема на работу",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "jobFacility",
            headerName: "Место работы",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "position",
            headerName: "Должность",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "qualification",
            headerName: "Квалификация",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "category",
            headerName: "Категория",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "categoryNumber",
            headerName: "Номер категории",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "categoryAssignmentDate",
            headerName: "Дата получения категории",
            type: "date",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "categoryAssignmentDeadlineDate",
            headerName: "Срок подтверждения категории",
            type: "date",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "docsSubmitDeadlineDate",
            headerName: "Срок подачи документов",
            type: "date",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "categoryPossiblePromotionDate",
            headerName: "Возможное повышение категории после",
            type: "date",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "courseHoursSum",
            headerName: "Сумма часов",
            type: "number",
            hide: true,
            headerAlign: "left",
            align: "left",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "courseHoursLeft",
            headerName: "Необходимый объем (оставшийся)",
            type: "number",
            headerAlign: "left",
            align: "left",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "education",
            headerName: "Образование",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "eduName",
            headerName: "УЗ",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "eduGraduationDate",
            headerName: "Дата окончания",
            type: "date",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
    ];

    const rows = employees
        ? employees.map(
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
          )
        : [];

    return (
        <div className="EmployeesTable">
            <div className="table">
                <DataGrid
                    onRowDoubleClick={(rowData) => {
                        history.push("/employees/" + rowData.row.id);
                    }}
                    onRowClick={(rowData) => {
                        props.setEmployeeId(rowData.row.id);
                    }}
                    rows={rows}
                    columns={columns}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    loading={props.tableLoading}
                />
            </div>
        </div>
    );
};

export default EmployeesTable;
