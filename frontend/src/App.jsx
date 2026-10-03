import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CounselorDashboard from './pages/CounselorDashboard';
import ItemRequestPage from './pages/ItemRequestPage';
import ItemApprovalPage from './pages/ItemApprovalPage';
import RoomManagementPage from './pages/RoomManagementPage';
import ResidenceManagementPage from './pages/ResidenceManagementPage';
import VisitorManagementPage from './pages/VisitorManagementPage';
import MyResidencePage from './pages/MyResidencePage';
import CounselorStatisticsPage from './pages/CounselorStatisticsPage';
import MaintenancePage from './pages/MaintenancePage';
import MaintenanceManagementPage from './pages/MaintenanceManagementPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/CounselorDashboard" element={<CounselorDashboard />} />
        <Route path="/item-request" element={<ItemRequestPage />} /> 
        <Route path="/item-request-approval" element={<ItemApprovalPage />} />
        <Route path="/room-management" element={<RoomManagementPage />} />
        <Route path="/residence-management" element={<ResidenceManagementPage />} />
        <Route path="/visitor-management" element={<VisitorManagementPage />} />
        <Route path="/my-residence" element={<MyResidencePage />} />
        <Route path="/counselor-statistics" element={<CounselorStatisticsPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/maintenance-handling" element={<MaintenanceManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;