import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 학교 원본 CSS 파일들 전역 적용
import './assets/css/layui.css'
import './assets/css/vpn.css'
import './assets/css/zTreeStyle.css'
import './assets/css/layer.css'
import './assets/css/custom.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)