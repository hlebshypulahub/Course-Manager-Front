import { combineReducers } from "redux";
import userReducer from "./user/user-reducer";
import errorReducer from "./error/error-reducer";
import messageReducer from "./message/message-reducer";
import tableReducer from "./employeeTable/table-reducer";

const rootReducer = combineReducers({
    user: userReducer,
    error: errorReducer,
    message: messageReducer,
    tableSettings: tableReducer,
});

export default rootReducer;
