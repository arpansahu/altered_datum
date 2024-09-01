import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h1>Something went wrong.</h1>
                    <p>We're sorry for the inconvenience. The error has been logged and we'll look into it.</p>
                    <button onClick={() => window.location.reload()}>Try Again</button>
                    <br />
                    <a href="/">Go to Homepage</a>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;