import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LottoPick from './pages/LottoPick';
import LottoDownloader from './pages/LottoDownloader';
import LottoHistory from './pages/LottoHistory';
import DeveloperLog from './pages/DeveloperLog';
import { Link } from 'react-router-dom';


function App() {


  return (
    <Router>
      {/* 내비게이션 바 - 모든 페이지에 고정 */}
      <nav className="navbar">
        <ul>
          <li><Link to="/LottoPick">홈</Link></li>
          <li><Link to="/history">역대로또 당첨번호</Link></li>
          <li><Link to="/developer">개발자 기록</Link></li>
          <li><Link to="/downloader">로또 데이터 다운로드</Link></li>
        </ul>
      </nav>

      {/* 라우트 설정 */}
      <div className="content">
        <Routes>
          <Route path="/LottoPick" element={<LottoPick />} />
          <Route path="/history" element={<LottoHistory />} />
          <Route path="/developer" element={<DeveloperLog />} />
          <Route path="/downloader" element={<LottoDownloader />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;