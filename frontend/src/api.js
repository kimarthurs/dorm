// src/api.js
import axios from 'axios';

// 백엔드 주소 기본 설정 (FastAPI가 8000포트에서 돈다고 가정)
const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // 실제 백엔드 주소로 변경
  headers: {
    'Content-Type': 'application/json',
  },
});

// 모든 요청을 보내기 전에 자동으로 토큰을 헤더에 끼워넣는 인터셉터
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'dummy-token') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;