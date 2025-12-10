
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route (redirects to home if already logged in)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return null; // Or spinner
    
    if (user) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
              <PublicRoute>
                  <LoginPage />
              </PublicRoute>
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            {/* Future Routes */}
            <Route path="trucks" element={<div className="text-center p-10">Trucks Module Loading...</div>} />
            <Route path="trailers" element={<div className="text-center p-10">Trailers Module Loading...</div>} />
            <Route path="fuel" element={<div className="text-center p-10">Fuel Module Loading...</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
