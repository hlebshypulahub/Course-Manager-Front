import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import "./App.css";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { clearError, getUserFromAPI } from "./redux";

function App() {
    const dispatch = useDispatch();
    let location = useLocation();

    useEffect(() => {
        dispatch(clearError());
    }, [location, dispatch]);

    useEffect(() => {
        dispatch(getUserFromAPI());
    }, [dispatch])

    return (
        <div className="App">
            <Dashboard />
        </div>
    );
}

export default App;
