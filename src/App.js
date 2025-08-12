import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import SecretPage from './components/SecretPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">로딩 중...</div>
        <div className="loading-dots">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <SecretPage /> : <LoginPage />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
