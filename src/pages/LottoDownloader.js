import React, { useState, useEffect } from 'react';
import axios from 'axios';
import existingLottoData from './LottoData';

function LottoDownloader() {
  const [latestDraw, setLatestDraw] = useState(null);
  const isLocal = process.env.NODE_ENV === 'development';
  console.log('NODE_ENV:', process.env.NODE_ENV, 'isLocal:', isLocal);

  useEffect(() => {
    console.log('latestDraw updated:', latestDraw);
  }, [latestDraw]);

  const fetchLatestDraw = async () => {
    if (isLocal) {
      const latestDataDraw = Math.max(...existingLottoData.map(item => item.drwNo));
      const latestDate = new Date(existingLottoData[existingLottoData.length - 1].drwNoDate);
      const now = new Date();
      if (now.getTimezoneOffset() !== -540) {
        now.setHours(now.getHours() + 9);
      }
      console.log('latestDate:', latestDate.toISOString(), 'now:', now.toISOString());

      const timeDiff = now - latestDate;
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const weeksSinceLastDraw = Math.ceil(daysDiff / 7);
      console.log('daysDiff:', daysDiff, 'weeksSinceLastDraw:', weeksSinceLastDraw);

      let estimatedDraw = latestDataDraw + weeksSinceLastDraw;
      console.log('estimatedDraw:', estimatedDraw);

      let maxDraw = latestDataDraw;
      for (let i = latestDataDraw + 1; i <= estimatedDraw + 1; i++) {
        try {
          const response = await axios.get(
            `/api/common.do?method=getLottoNumber&drwNo=${i}` // 프록시 경로
          );
          const data = response.data;
          console.log(`drwNo ${i} response:`, data);
          if (data.returnValue === 'success') {
            maxDraw = Math.max(maxDraw, data.drwNo);
          } else {
            console.log(`drwNo ${i} is invalid`);
            break;
          }
        } catch (error) {
          console.error(`API 호출 오류 (drwNo ${i}):`, error.message);
          break;
        }
      }
      console.log('final maxDraw:', maxDraw);
      setLatestDraw(maxDraw);
    } else {
      const maxDraw = Math.max(...existingLottoData.map(item => item.drwNo));
      console.log('GitHub Pages maxDraw:', maxDraw);
      setLatestDraw(maxDraw);
    }
  };

  useEffect(() => {
    fetchLatestDraw().catch(() => {
      const maxDraw = Math.max(...existingLottoData.map(item => item.drwNo));
      setLatestDraw(maxDraw);
    });
  }, [isLocal, existingLottoData]);

  const updateLottoData = async () => {
    if (!latestDraw) {
      console.log('latestDraw is null, cannot update');
      return;
    }

    const existingDrawNumbers = existingLottoData.map(item => item.drwNo);
    const lastExistingDraw = Math.max(...existingDrawNumbers);
    console.log('lastExistingDraw:', lastExistingDraw, 'latestDraw:', latestDraw);

    const requests = [];
    for (let i = lastExistingDraw + 1; i <= latestDraw; i++) {
      if (isLocal) {
        console.log(`Requesting drwNo ${i}`);
        requests.push(
          axios
            .get(`/api/common.do?method=getLottoNumber&drwNo=${i}`) // 프록시 경로
            .then(res => {
              console.log(`drwNo ${i} fetched:`, res.data);
              return res.data;
            })
            .catch(error => {
              console.error(`Error fetching drwNo ${i}:`, error.message);
              return null;
            })
        );
      } else {
        const existingData = existingLottoData.find(item => item.drwNo === i);
        requests.push(Promise.resolve(existingData));
      }
    }

    const newResults = await Promise.all(requests);
    const newValidResults = newResults.filter(r => r && (isLocal ? r.returnValue === 'success' : r));
    console.log('newValidResults:', newValidResults);

    const combinedData = [...existingLottoData, ...newValidResults];
    console.log('combinedData length:', combinedData.length);

    const blob = new Blob([JSON.stringify(combinedData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LottoNumber_updated.json';
    a.click();
    URL.revokeObjectURL(url); // 오타 수정
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '70px' }}>
      <button style={{ fontSize: '25px' }} onClick={updateLottoData} disabled={!latestDraw}>
        로또 당첨번호 다운로드 (최신 회차: {latestDraw || '로딩 중...'})
      </button>
    </div>
  );
}

export default LottoDownloader;