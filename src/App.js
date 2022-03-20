import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import "./App.css";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { clearError, clearMessage } from "./redux";

function App() {
    const dispatch = useDispatch();
    let location = useLocation();

    useEffect(() => {
        dispatch(clearError());
        dispatch(clearMessage());
    }, [location, dispatch]);

    return (
        <div className="App">
            <Dashboard />
        </div>
    );
}

export default App;
