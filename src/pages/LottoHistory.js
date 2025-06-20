import React, { useState, useEffect } from 'react';
import LottoData from './LottoData';
import './LottoHistory.css';

function LottoHistory() {
    const [drawNumber, setDrawNumber] = useState('');
    const [lottoData, setLottoData] = useState(null);

    // LottoData에서 최신 회차 계산
    const latestDraw = Math.max(...LottoData.map(item => item.drwNo));

    useEffect(() => {
        // 초기 로드 시 최신 회차 데이터 설정
        const data = LottoData.find(item => item.drwNo === latestDraw);
        setLottoData(data || null);
        setDrawNumber(latestDraw.toString()); // 입력창에 최신 회차 표시
    }, [latestDraw]);

    const handleSearch = () => {
        const num = parseInt(drawNumber);
        if (num >= 1 && num <= latestDraw) {
            const data = LottoData.find(item => item.drwNo === num);
            setLottoData(data || null);
        } else {
            alert(`1부터 ${latestDraw}회까지의 유효한 회차를 입력하세요.`);
        }
    };

    return (
        <div className="history-container">
            <div className="history-panel">
                <h2>역대 로또 당첨번호</h2>
                <div>
                    <input
                        type="number"
                        value={drawNumber}
                        onChange={(e) => setDrawNumber(e.target.value)}
                        placeholder={`회차를 입력하세요 (최신: ${latestDraw || '로딩 중...'})`}
                    />
                    <button onClick={handleSearch}>조회</button>
                </div>
                {lottoData ? (
                    <div className="history-content">
                        <h3>제 {lottoData.drwNo}회 ({lottoData.drwNoDate})</h3>
                        <p>1등 당첨 상금: {lottoData.firstWinamnt.toLocaleString()}원</p>
                        <div className="history-numbers">
                            {[
                                lottoData.drwtNo1,
                                lottoData.drwtNo2,
                                lottoData.drwtNo3,
                                lottoData.drwtNo4,
                                lottoData.drwtNo5,
                                lottoData.drwtNo6,
                            ].map((num) => (
                                <img
                                    key={num}
                                    src={`https://www.lotto.co.kr/resources/images/lottoball_92/on/${num}.png`}
                                    alt={`Number ${num}`}
                                />
                            ))}
                            <span>+</span>
                            <img
                                src={`https://www.lotto.co.kr/resources/images/lottoball_92/on/${lottoData.bnusNo}.png`}
                                alt={`Bonus ${lottoData.bnusNo}`}
                            />
                        </div>
                    </div>
                ) : (
                    <p>회차 데이터를 불러오지 못했습니다. 유효한 회차를 입력하세요.</p>
                )}
            </div>
        </div>
    );
}

export default LottoHistory;