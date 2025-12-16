import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/auth/login';
import Register from './components/auth/register';
import MainPage from './pages/main';
import { UserProvider } from './context/user.context';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('accessToken') ;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/main" 
          element={
            <ProtectedRoute>
              <MainPage/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;