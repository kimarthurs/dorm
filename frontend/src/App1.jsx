import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>登录成功！欢迎您。</h1>
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }}>
        退出
      </button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;