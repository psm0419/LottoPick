import React from 'react';
import axios from 'axios';
import existingLottoData from './LottoData';

function LottoUpdater() {
  const TOTAL_DRAW = 1171; // 최신 회차 (동행복권 기준)

  const updateLottoData = async () => {
    const existingDrawNumbers = existingLottoData.map(item => item.drwNo);
    const lastExistingDraw = Math.max(...existingDrawNumbers);

    const requests = [];
    for (let i = lastExistingDraw + 1; i <= TOTAL_DRAW; i++) {
      requests.push(
        axios
          .get(`/common.do?method=getLottoNumber&drwNo=${i}`)
          .then(res => res.data)
          .catch(() => null)
      );
    }

    const newResults = await Promise.all(requests);
    const newValidResults = newResults.filter(r => r && r.returnValue === 'success');

    const combinedData = [...existingLottoData, ...newValidResults];

    // 저장할 파일 생성
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
    <div>      
      <button onClick={updateLottoData}>로또 당첨번호 다운로드</button>
    </div>
  );
}

export default LottoUpdater;
