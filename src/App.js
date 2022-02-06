import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
// import { history } from "./helpers/history";
import { clearMessage } from "./actions/message";
import "./App.css";
import { Dashboard } from "./pages/Dashboard";

function App() {
    const dispatch = useDispatch();

    let location = useLocation();

    useEffect(() => {
        dispatch(clearMessage()); // clear message when changing location
    }, [location, dispatch]);

    return (
        <div className="App">
            <Dashboard />
        </div>
    );
}

export default App;
