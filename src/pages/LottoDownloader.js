import React, { useState, useEffect } from 'react';
import axios from 'axios';
import existingLottoData from './LottoData';

function LottoDownloader() {
  const [latestDraw, setLatestDraw] = useState(null);

  // 환경 변수로 API 사용 여부 결정 (로컬: true, GitHub Pages: false)
  const isLocal = process.env.NODE_ENV === 'development';

  // 최신 회차 가져오기
  useEffect(() => {
    const fetchLatestDraw = async () => {
      if (isLocal) {
        // 로컬 환경: LottoData의 최신 회차와 현재 날짜 비교
        const latestDataDraw = Math.max(...existingLottoData.map(item => item.drwNo));
        const latestDate = new Date(existingLottoData[existingLottoData.length - 1].drwNoDate);
        const now = new Date();
        now.setHours(now.getHours() + 9); // UTC를 KST로 변환 (UTC+9)
        const timeDiff = now - latestDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const weeksSinceLastDraw = Math.floor(daysDiff / 7); // 일주일 간격 (토요일)

        let estimatedDraw = latestDataDraw;
        // 토요일 8:40 이후가 아니면 현재 회차 유지
        if (now.getDay() === 6 && now.getHours() >= 20 && now.getMinutes() >= 40) {
          estimatedDraw += weeksSinceLastDraw + 1; // 다음 회차
        } else {
          estimatedDraw += weeksSinceLastDraw; // 현재 회차
        }

        // API로 확인 (1175 이후부터 estimatedDraw까지)
        let maxDraw = latestDataDraw;
        for (let i = latestDataDraw + 1; i <= estimatedDraw; i++) {
          try {
            const response = await axios.get(
              `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${i}`
            );
            const data = response.data;
            if (data.returnValue === 'success') {
              maxDraw = Math.max(maxDraw, data.drwNo);
            } else {
              break; // 유효한 회차가 없으면 중단
            }
          } catch (error) {
            console.error(`API 호출 오류 (drwNo ${i}):`, error);
            break;
          }
        }
        setLatestDraw(maxDraw);
      } else {
        // GitHub Pages: LottoData에서 최대 회차 사용
        const maxDraw = Math.max(...existingLottoData.map(item => item.drwNo));
        setLatestDraw(maxDraw);
      }
    };

    fetchLatestDraw().catch(() => {
      // 에러 발생 시 LottoData 최대 회차로 대체
      const maxDraw = Math.max(...existingLottoData.map(item => item.drwNo));
      setLatestDraw(maxDraw);
    });
  }, [isLocal]);

  const updateLottoData = async () => {
    if (!latestDraw) return;

    const existingDrawNumbers = existingLottoData.map(item => item.drwNo);
    const lastExistingDraw = Math.max(...existingDrawNumbers);

    const requests = [];
    for (let i = lastExistingDraw + 1; i <= latestDraw; i++) {
      if (isLocal) {
        requests.push(
          axios
            .get(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${i}`)
            .then(res => res.data)
            .catch(() => null)
        );
      } else {
        // GitHub Pages에서는 기존 데이터만 사용
        const existingData = existingLottoData.find(item => item.drwNo === i);
        requests.push(Promise.resolve(existingData));
      }
    }

    const newResults = await Promise.all(requests);
    const newValidResults = newResults.filter(r => r && (isLocal ? r.returnValue === 'success' : r));

    const combinedData = [...existingLottoData, ...newValidResults];

    const blob = new Blob([JSON.stringify(combinedData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LottoNumber_updated.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop:'70px' }}>      
      <button style={{fontSize: '25px'}}onClick={updateLottoData} disabled={!latestDraw}>
        로또 당첨번호 다운로드 (최신 회차: {latestDraw || '로딩 중...'})
      </button>
    </div>
  );
}

export default LottoDownloader;