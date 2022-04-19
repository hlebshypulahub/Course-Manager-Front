import React from "react";

import ErrorPage from "./ErrorPage";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });

        // Log the error to service
    }

    render() {
        // if (this.state.errorInfo) {
        //     return (
        //         <div>
        //             <h2>Something went wrong.</h2>
        //             <details style={{ whiteSpace: "pre-wrap" }}>
        //                 {this.state.error && this.state.error.toString()}
        //                 <br />
        //                 {this.state.errorInfo.componentStack}
        //             </details>
        //         </div>
        //     );
        // }

        return <ErrorPage />;
    }
}

export default ErrorBoundary;
