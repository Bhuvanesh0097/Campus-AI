import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudyBuddy from './pages/StudyBuddy';
import PlacementPrep from './pages/PlacementPrep';
import Feedback from './pages/Feedback';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

export default function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route path="/study-buddy" element={<StudyBuddy />} />
                <Route path="/placement-prep" element={<PlacementPrep />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/study-buddy" replace />} />
        </Routes>
    );
}
