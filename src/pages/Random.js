import React, { useState } from 'react';

// 번호별 당첨 횟수
const numberCounts = {
    1: 159, 2: 149, 3: 159, 4: 153, 5: 146, 6: 155, 7: 160, 8: 148, 9: 126, 10: 155,
    11: 158, 12: 171, 13: 169, 14: 166, 15: 157, 16: 156, 17: 162, 18: 168, 19: 160, 20: 162,
    21: 161, 22: 138, 23: 139, 24: 156, 25: 145, 26: 158, 27: 168, 28: 144, 29: 147, 30: 149,
    31: 158, 32: 137, 33: 167, 34: 179, 35: 154, 36: 155, 37: 164, 38: 161, 39: 160, 40: 164,
    41: 141, 42: 148, 43: 159, 44: 155, 45: 168,
};

function Random({ onHighlightedNumbers }) {
    // 로또 번호 가중치 배열을 최적화
    const weightedNumbers = Object.keys(numberCounts).reduce((acc, num) => {
        const count = numberCounts[num];
        return acc.concat(Array(count).fill(Number(num))); // 각 번호를 등장 횟수만큼 추가
    }, []);

    // 랜덤 번호 뽑기 함수
    const getRandomLottoNumber = () => {
        const randomIndex = Math.floor(Math.random() * weightedNumbers.length);
        return weightedNumbers[randomIndex];
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

    // 상태: 로또 번호 및 시뮬레이션 결과
    const [lottoNumbers, setLottoNumbers] = useState(generateLottoNumbers());
    const [simulationResults, setSimulationResults] = useState(null);

    // 새로운 번호가 생성되면 부모 컴포넌트로 전달
    const handleGenerateLottoNumbers = () => {
        const newLottoNumbers = generateLottoNumbers();
        setLottoNumbers(newLottoNumbers);
        onHighlightedNumbers(newLottoNumbers);  // 뽑힌 번호를 부모로 전달
    };

    // 1만회 시뮬레이션 함수
    const runSimulation = () => {
        const simCount = 10000;
        const frequency = {};
        // 초기화
        for (let i = 1; i <= 45; i++) {
            frequency[i] = 0;
        }

        // 1만회 번호 생성
        for (let i = 0; i < simCount; i++) {
            const numbers = generateLottoNumbers();
            numbers.forEach(num => {
                frequency[num]++;
            });
        }

        // 비율 계산 및 비율 높은 순 정렬
        const totalNumbers = simCount * 6;
        const results = Object.keys(frequency).map(num => ({
            number: Number(num),
            count: frequency[num],
            percentage: ((frequency[num] / totalNumbers) * 100).toFixed(2),
        })).sort((a, b) => b.percentage - a.percentage || a.number - b.number); // 비율 내림차순, 비율 같으면 번호 오름차순

        setSimulationResults(results);
    };

    return (
        <div>
            <h2>랜덤 로또 번호</h2>
            <div>
                <button onClick={handleGenerateLottoNumbers} style={{ marginRight: '10px' }}>
                    새로운 번호 생성
                </button>
                <button onClick={runSimulation}>
                    1만회 시뮬레이션
                </button>
            </div>
            <div>
                {lottoNumbers.map((num, index) => (
                    <span key={index} style={{ margin: '0 10px' }}>
                        {num}
                    </span>
                ))}
            </div>
            {simulationResults && (
                <div style={{ marginTop: '20px' }}>
                    <h3>1만회 시뮬레이션 결과 (비율 높은 순)</h3>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(9, 1fr)',
                            gap: '10px',
                        }}
                    >
                        {simulationResults.map(({ number, count, percentage }) => (
                            <div
                                key={number}
                                style={{
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    textAlign: 'center',
                                    background: '#f9f9f9',
                                }}
                            >
                                <strong>{number}</strong>번<br />
                                {count}회<br />
                                ({percentage}%)
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Random;