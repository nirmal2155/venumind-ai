import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-6">
          <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center border-t border-[var(--border-red)] bg-[var(--bg-card)]">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-red-dim)] flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-[var(--accent-red)]">warning</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">System Interruption</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              VenueMind AI encountered an unexpected operational anomaly. Core systems are recovering.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-[var(--accent-blue)] hover:bg-blue-600 text-white rounded-xl font-bold transition-all"
            >
              Restart Terminal
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 text-left p-4 bg-black/10 rounded-lg overflow-auto text-xs text-[var(--text-muted)]">
                <p className="font-mono text-red-400 mb-2">{this.state.error && this.state.error.toString()}</p>
                <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
