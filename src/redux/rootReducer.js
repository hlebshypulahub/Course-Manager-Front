import { combineReducers } from "redux";
import userReducer from "./user/userReducer";
import errorReducer from "./error/errorReducer";
import messageReducer from "./message/messageReducer";
import tableReducer from "./employeeTable/tableReducer";

const rootReducer = combineReducers({
    user: userReducer,
    error: errorReducer,
    message: messageReducer,
    tableSettings: tableReducer,
});

export default rootReducer;
