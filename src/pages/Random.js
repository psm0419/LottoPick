import React, { useState } from 'react';

// 번호별 당첨 횟수
const numberCounts = {
    1: 159, 2: 149, 3: 159, 4: 153, 5: 146, 6: 155, 7: 160, 8: 148, 9: 126, 10: 155,
    11: 158, 12: 171, 13: 169, 14: 166, 15: 157, 16: 156, 17: 162, 18: 168, 19: 160, 20: 162,
    21: 161, 22: 138, 23: 139, 24: 156, 25: 145, 26: 158, 27: 168, 28: 144, 29: 147, 30: 149,
    31: 158, 32: 137, 33: 167, 34: 179, 35: 154, 36: 155, 37: 164, 38: 161, 39: 160, 40: 164,
    41: 141, 42: 148, 43: 159, 44: 155, 45: 168,
};

function Random() {
    // 번호별 가중치 계산
    const totalCount = Object.values(numberCounts).reduce((sum, count) => sum + count, 0);
    const weightedNumbers = Object.keys(numberCounts).map(num => {
        const weight = numberCounts[num] / totalCount;  // 가중치 계산
        return { num: Number(num), weight };
    });

    // 랜덤 번호 뽑기 함수 (비율 기반)
    const getRandomLottoNumber = () => {
        const random = Math.random();
        let cumulativeWeight = 0;
        for (const { num, weight } of weightedNumbers) {
            cumulativeWeight += weight;
            if (random < cumulativeWeight) {
                return num;
            }
        }
    };

    // 로또 번호 6개 뽑기
    const generateLottoNumbers = () => {
        const lottoNumbers = [];
        while (lottoNumbers.length < 6) {
            const number = getRandomLottoNumber();
            if (!lottoNumbers.includes(number)) {  // 중복 방지
                lottoNumbers.push(number);
            }
        }
        return lottoNumbers.sort((a, b) => a - b);  // 번호 순으로 정렬
    };

    const [lottoNumbers, setLottoNumbers] = useState(generateLottoNumbers());

    return (
        <div>
            <h2>랜덤 로또 번호</h2>
            <div>
                <button onClick={() => setLottoNumbers(generateLottoNumbers())}>새로운 번호 생성</button>
            </div>
            <div>
                {lottoNumbers.map((num, index) => (
                    <span key={index} style={{ margin: '0 10px' }}>
                        {num}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default Random;
