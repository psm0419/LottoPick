import React, { useState } from 'react';
import LottoData from './LottoData';
import Random from './Random';

function LottoPick() {
    // 번호 등장 횟수 카운팅
    const numberCounts = {};
    for (let i = 1; i <= 45; i++) {
        numberCounts[i] = 0;
    }

    // 전체 당첨 횟수
    let totalCount = 0;

    LottoData.forEach(draw => {
        for (let i = 1; i <= 6; i++) {
            const key = `drwtNo${i}`;
            const number = draw[key];
            if (number) {
                numberCounts[number]++;
                totalCount++;  // 전체 당첨 횟수 증가
            }
        }
    });

    // 상태: 정렬 방식 (number 또는 count)
    const [sortBy, setSortBy] = useState('number');
    const [highlightedNumbers, setHighlightedNumbers] = useState([]);  // 뽑힌 번호를 저장할 상태 추가

    // 배열 변환 및 정렬
    const sortedNumbers = Object.keys(numberCounts)
        .map(num => ({
            number: Number(num),
            count: numberCounts[num],
            // 비율 계산
            percentage: ((numberCounts[num] / totalCount) * 100).toFixed(2),
        }))
        .sort((a, b) => {
            if (sortBy === 'number') return a.number - b.number;
            else return b.count - a.count;
        });

    // 랜덤 번호 뽑기 완료 시 호출되는 함수
    const handleHighlightedNumbers = (numbers) => {
        setHighlightedNumbers(numbers);  // 뽑힌 번호로 상태 업데이트
    };

    return (
        <div style={{ margin: '15px' }}>
            <h2>로또 번호별 1등 당첨 횟수</h2>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setSortBy('number')}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        backgroundColor: sortBy === 'number' ? '#4CAF50' : '#f1f1f1',
                        color: sortBy === 'number' ? '#fff' : '#000',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: sortBy === 'number' ? 'bold' : 'normal',
                    }}>
                    번호 순 정렬
                </button>

                <button onClick={() => setSortBy('count')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: sortBy === 'count' ? '#4CAF50' : '#f1f1f1',
                        color: sortBy === 'count' ? '#fff' : '#000',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: sortBy === 'count' ? 'bold' : 'normal',
                    }}>
                    당첨 횟수 순 정렬
                </button>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(9, 1fr)',
                    gap: '10px',
                }}
            >
                {sortedNumbers.map(({ number, count, percentage }) => (
                    <div
                        key={number}
                        style={{
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            textAlign: 'center',
                            background: highlightedNumbers.includes(number) ? '#ffeb3b' : '#f9f9f9', // 색칠
                        }}
                    >
                        <strong>{number}</strong>번<br />
                        {count}회<br />
                        ({percentage}%)
                    </div>
                ))}
            </div>
            <Random onHighlightedNumbers={handleHighlightedNumbers} />  {/* 뽑힌 번호를 부모 컴포넌트로 전달 */}
        </div>
    );
}

export default LottoPick;
