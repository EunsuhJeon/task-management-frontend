import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import GuestRoute from './auth/GuestRoute';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from './layout/AppLayout';
import InviteAcceptPage from './pages/InviteAcceptPage';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import TeamBoardPage from './pages/TeamBoardPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="teams/:teamId" element={<TeamBoardPage />} />
              <Route path="invite/:token" element={<InviteAcceptPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
