import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/auth/login';
import Register from './components/auth/register';
import MainPage from './pages/main';
import { UserProvider } from './context/user.context';
import NotificationsPage from './components/notifications/notifications';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/code" element={<Register />} />
        <Route 
          path="/main" 
          element={
              <MainPage/>
          }
        />
        <Route path='/admin/notifications' element={<NotificationsPage/>}/>
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;