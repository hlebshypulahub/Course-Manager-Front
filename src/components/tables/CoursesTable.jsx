//// React

import moment from "moment";

//// CSS
import "./CoursesTable.scss";

//// Functions
import { parseDates as parse } from "../../helpers/parse-dates";
import { scrollProps, i18n } from "./TableProps";
import { courseColumns as columns } from "./TableColumns";
// import { CourseColumns } from "./TableColumns";

//// ReactDataGrid
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";

const CoursesTable = ({ courses, isCoursesLoading, fetchEmployee }) => {
    window.moment = moment;

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

    // const courseColumns = new CourseColumns(fetchEmployee);

    return (
        <div className="CoursesTable">
            <div className="table">
                <ReactDataGrid
                    idProperty="name"
                    columns={columns}
                    dataSource={rows}
                    defaultSortInfo={{
                        name: "startDate",
                        dir: -1,
                        type: "date",
                    }}
                    loading={isCoursesLoading}
                    rowHeight={50}
                    scrollProps={scrollProps}
                    shareSpaceOnResize
                    i18n={i18n}
                />
            </div>
        </div>
    );
};

export default CoursesTable;
