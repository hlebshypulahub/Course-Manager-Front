import { combineReducers } from "redux";
import userReducer from "./user/userReducer";
import errorReducer from "./error/errorReducer";
import messageReducer from "./message/messageReducer";

const rootReducer = combineReducers({
    user: userReducer,
    error: errorReducer,
    message: messageReducer,
});

export default rootReducer;
