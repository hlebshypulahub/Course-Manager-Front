import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "../css/CoursesTable.scss";
import { DateParser as parse } from "../helpers/DateParser";

import { getEmployeeCourses } from "../services/course.service";

const CoursesTable = (props) => {
    const employeeId = props.employeeId;
    const [courses, setCourses] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = () => {
            getEmployeeCourses(employeeId).then((data) => {
                setCourses(data);
                setLoading(false);
            });
        };

        fetchCourses();
    }, [employeeId]);

    const columns = [
        { field: "name", headerName: "Название", width: 200 },
        {
            field: "description",
            headerName: "Описание",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "hours",
            headerName: "Количество часов",
            type: "number",
            headerAlign: "left",
            align: "left",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "startDate",
            type: "date",
            headerName: "Дата начала",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "endDate",
            type: "date",
            headerName: "Дата окончания",
            flex: 1,
            minWidth: 200,
        },
    ];

    const rows = courses
        ? courses.map(
              ({ id, name, description, hours, startDate, endDate }) => {
                  return {
                      id,
                      name,
                      description,
                      hours,
                      startDate: parse(startDate),
                      endDate: parse(endDate),
                  };
              }
          )
        : [];

    return (
        <div className="CoursesTable">
            <div className="table">
                <DataGrid rows={rows} columns={columns} loading={isLoading} />
            </div>
        </div>
    );
};

export default CoursesTable;
