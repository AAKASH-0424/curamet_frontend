import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    
    // Check auth status on load
    checkAuthStatus();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={isAuthenticated ? <HomePage user={user} /> : <Navigate to="/auth" />} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage user={user} /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} />} />
      </Routes>
    </Router>
  );
}

export default App;