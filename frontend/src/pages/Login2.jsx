import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

    const handleLogin = (e) => {
            e.preventDefault();
            
            if (username === 'fudaoyuan') {
                localStorage.setItem('userRole', 'counselor');
                localStorage.setItem('userName', '张柱'); 
            } else if (username === 'susheguanliyuan') {
                localStorage.setItem('userRole', 'dormAdmin');
                localStorage.setItem('userName', '王'); 
            } else if (username === 'xuesheng') {
                localStorage.setItem('userRole', 'student');
                localStorage.setItem('userName', '金将源'); 
            }

            localStorage.setItem('token', 'dummy-token');
            
            if (username === 'fudaoyuan') {
                navigate('/CounselorDashboard');
            } else if (username === 'susheguanliyuan') {
                navigate('/AdminDashboard');
            } else {
                navigate('/StudentDashboard');
            }
        };

  return (
    <div style={{ 
      height: '100vh', 
      backgroundImage: 'url("/background.jpg")',
      backgroundSize: 'cover', 
      backgroundPosition: 'center center',
      backgroundColor: '#f1f5f8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>

      <div style={{ width: '420px', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', padding: '40px 30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/logo.png" alt="logo" style={{ height: '30px', marginBottom: '15px' }} />
          <h2 style={{ fontSize: '20px', color: '#333', fontWeight: 'bold' }}>统一身份认证</h2>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="text" 
              className="layui-input" 
              placeholder="请输入学工号/绑定手机/证件号" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              style={{ height: '45px', fontSize: '15px' }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <input 
              type="password" 
              className="layui-input" 
              placeholder="请输入密码" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{ height: '45px', fontSize: '15px' }}
            />
          </div>

          <button 
            type="submit" 
            className="layui-btn layui-btn-normal" 
            style={{ width: '100%', height: '45px', fontSize: '16px', borderRadius: '4px' }}
          >
            立即登录
          </button>
        </form>

        <div style={{ textAlign: 'right', marginTop: '15px' }}>
          <span style={{ color: '#1E9FFF', cursor: 'pointer', fontSize: '13px' }}></span>
        </div>

      </div>
      
      <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', color: '#fff', fontSize: '12px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
         北京理工大学版权所有     技术支持：数字化与智算技术中心     联系电话：68914833 
      </div>

    </div>
  );
}