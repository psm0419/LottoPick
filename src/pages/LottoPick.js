import React from 'react';
import LottoData from './LottoData';

function LottoPick() {
    // 1~45번을 0으로 초기화
    const numberCounts = {};
    for (let i = 1; i <= 45; i++) {
        numberCounts[i] = 0;
    }

    // 데이터 순회하면서 1등 번호만 카운트
    LottoData.forEach(draw => {
        for (let i = 1; i <= 6; i++) {
            const key = `drwtNo${i}`;
            const number = draw[key];
            if (number) {
                numberCounts[number]++;
            }
        }
    });

    // 숫자 정렬(1~45)
    const sortedNumbers = Object.keys(numberCounts)
        .sort((a, b) => a - b)
        .map(num => ({
            number: Number(num),
            count: numberCounts[num],
        }));

    return (
        <div>
            <h2>로또 번호별 1등 당첨 횟수</h2>
            <ul>
                {sortedNumbers.map(({ number, count }) => (
                    <li key={number}>
                        {number}번: {count}회
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LottoPick;
