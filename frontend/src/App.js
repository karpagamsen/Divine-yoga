import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import SessionDetail from './pages/SessionDetail';
import { Toaster } from './components/ui/sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-warm-orange text-xl font-heading">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={!user ? <Welcome /> : <Navigate to="/home" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/home" />} />
          <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
          <Route path="/explore" element={user ? <Explore /> : <Navigate to="/" />} />
          <Route path="/schedule" element={user ? <Schedule /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
          <Route path="/session/:sessionId" element={user ? <SessionDetail /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </AuthContext.Provider>
  );
}

export default App;