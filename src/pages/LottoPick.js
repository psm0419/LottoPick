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
                totalCount++; // 전체 당첨 횟수 증가
            }
        }
    });

    const sortedByFrequency = Object.entries(numberCounts)
        .map(([num, count]) => ({ num: parseInt(num), count }))
        .sort((a, b) => b.count - a.count || a.num - b.num);

    const groupA = new Set(sortedByFrequency.slice(0, 23).map(item => item.num));
    const groupB = new Set(sortedByFrequency.slice(23).map(item => item.num));

    // 상태: 정렬 방식 (number 또는 count)
    const [sortBy, setSortBy] = useState('number');
    const [highlightedNumbers, setHighlightedNumbers] = useState([]); // 뽑힌 번호를 저장할 상태 추가

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
        setHighlightedNumbers(numbers); // 뽑힌 번호로 상태 업데이트
    };

    return (
        <div style={{ margin: '20px' }}>
            <h2>로또 번호별 1등 당첨 횟수</h2>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setSortBy('number')}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        backgroundColor: sortBy === 'number' ? '#4CAF50' : '#f1f1f1',
                        color: sortBy === 'number' ? '#fff' : '#000',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: sortBy === 'number' ? 'bold' : 'normal',
                    }}
                >
                    번호 순 정렬
                </button>

                <button
                    onClick={() => setSortBy('count')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: sortBy === 'count' ? '#4CAF50' : '#f1f1f1',
                        color: sortBy === 'count' ? '#fff' : '#000',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: sortBy === 'count' ? 'bold' : 'normal',
                    }}
                >
                    당첨 횟수 순 정렬
                </button>
                <span style={{ marginLeft: '5px' }}>당첨횟수가 많은 그룹을 A그룹(파란색), 횟수가 적은 그룹을 B그룹(회색)으로 분류</span>
                <p>역대 로또 당첨번호들의 A,B그룹의 조합</p>
                <p>
                    0A+6B: 7회,
                    1A+5B: 52회,
                    2A+4B: 205회,
                    3A+3B: 361회,
                    4A+2B: 347회,
                    5A+1B: 166회,
                    6A+0B: 31회
                </p>
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
                            padding: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            textAlign: 'center',
                            background: highlightedNumbers.includes(number)
                                ? '#ffeb3b' // Yellow for highlighted numbers
                                : groupA.has(number)
                                    ? '#e3f2fd' // Light blue for Group A
                                    : '#f5f5f5', // Light gray for Group B
                        }}
                    >
                        <img
                            src={`https://www.lotto.co.kr/resources/images/lottoball_92/on/${number}.png`}
                            alt={`Number ${number}`}
                            style={{ width: '40px', height: '40px', marginBottom: '5px' }}
                        />
                        <br />
                        {count}회<br />
                        ({percentage}%)
                    </div>
                ))}
            </div>
            <Random onHighlightedNumbers={handleHighlightedNumbers} />
        </div>
    );
}

export default LottoPick;