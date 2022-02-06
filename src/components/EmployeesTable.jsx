import React from "react";
import { useHistory } from "react-router";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DateParser as parse } from "../helpers/DateParser";
import "../css/EmployeesTable.scss";

const EmployeesTable = (props) => {
    const employees = props.employees;

    const history = useHistory();

    const columns = [
        { field: "fullName", headerName: "Imię i nazwisko", width: 250 },
        {
            field: "hiringDate",
            headerName: "Data zatrudnienia",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "jobFacility",
            headerName: "Miejsce pracy",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "position",
            headerName: "Stanowisko",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "qualification",
            headerName: "Kwalifikacja",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "category",
            headerName: "Kategoria",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "categoryNumber",
            headerName: "Numer kategorii",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "categoryAssignmentDate",
            headerName: "Data nadania kategorii",
            type: "date",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "categoryAssignmentDeadlineDate",
            headerName: "Termin potwierdzenia kategorii",
            type: "date",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "docsSubmitDeadlineDate",
            headerName: "Termin dostarczenia dokumentów",
            type: "date",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "categoryPossiblePromotionDate",
            headerName: "Możliwe nadanie kolejnej kategorii po",
            type: "date",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "courseHoursSum",
            headerName: "Suma godzin",
            type: "number",
            hide: true,
            headerAlign: "left",
            align: "left",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "courseHoursLeft",
            headerName: "Pozostała ilość godzin",
            type: "number",
            headerAlign: "left",
            align: "left",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "education",
            headerName: "Wykształcenie",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "eduName",
            headerName: "Szkoła",
            hide: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "eduGraduationDate",
            headerName: "Data zakończenia studiów",
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
