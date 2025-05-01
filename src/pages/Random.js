import React, { useState } from 'react';

// 번호별 당첨 횟수
const numberCounts = {
    1: 159, 2: 149, 3: 159, 4: 153, 5: 146, 6: 155, 7: 160, 8: 148, 9: 126, 10: 155,
    11: 158, 12: 171, 13: 169, 14: 166, 15: 157, 16: 156, 17: 162, 18: 168, 19: 160, 20: 162,
    21: 161, 22: 138, 23: 139, 24: 156, 25: 145, 26: 158, 27: 168, 28: 144, 29: 147, 30: 149,
    31: 158, 32: 137, 33: 167, 34: 179, 35: 154, 36: 155, 37: 164, 38: 161, 39: 160, 40: 164,
    41: 141, 42: 148, 43: 159, 44: 155, 45: 168,
};

// 그룹 A와 B 정의 (빈도 순위 기반, 번호 15는 B그룹)
const groupA = new Set([34, 12, 13, 18, 27, 45, 33, 14, 37, 40, 17, 20, 21, 38, 7, 19, 39, 1, 3, 43, 11, 26, 31]);
const groupB = new Set([15, 16, 24, 6, 10, 36, 44, 35, 4, 2, 30, 8, 42, 29, 5, 25, 28, 41, 23, 22, 32, 9]);

function Random({ onHighlightedNumbers }) {
    // 그룹별 가중치 배열 생성
    const weightedGroupA = Array.from(groupA).reduce((acc, num) => {
        return acc.concat(Array(numberCounts[num]).fill(num));
    }, []);
    const weightedGroupB = Array.from(groupB).reduce((acc, num) => {
        return acc.concat(Array(numberCounts[num]).fill(num));
    }, []);

    // 랜덤 번호 뽑기 함수 (특정 그룹에서)
    const getRandomNumberFromGroup = (weightedGroup) => {
        const randomIndex = Math.floor(Math.random() * weightedGroup.length);
        return weightedGroup[randomIndex];
    };

    // 기존 로또 번호 6개 뽑기 (가중치 기반, 그룹 구분 없음)
    const generateLottoNumbers = () => {
        const weightedNumbers = Object.keys(numberCounts).reduce((acc, num) => {
            const count = numberCounts[num];
            return acc.concat(Array(count).fill(Number(num)));
        }, []);
        const lottoNumbers = [];
        while (lottoNumbers.length < 6) {
            const randomIndex = Math.floor(Math.random() * weightedNumbers.length);
            const number = weightedNumbers[randomIndex];
            if (!lottoNumbers.includes(number)) {
                lottoNumbers.push(number);
            }
        }
        return lottoNumbers.sort((a, b) => a - b);
    };

    // 3A+3B 뽑기
    const generate3A3B = () => {
        const lottoNumbers = [];
        // A그룹에서 3개 뽑기
        while (lottoNumbers.length < 3) {
            const number = getRandomNumberFromGroup(weightedGroupA);
            if (!lottoNumbers.includes(number)) {
                lottoNumbers.push(number);
            }
        }
        // B그룹에서 3개 뽑기
        while (lottoNumbers.length < 6) {
            const number = getRandomNumberFromGroup(weightedGroupB);
            if (!lottoNumbers.includes(number)) {
                lottoNumbers.push(number);
            }
        }
        return lottoNumbers.sort((a, b) => a - b);
    };

    // 4A+2B 뽑기
    const generate4A2B = () => {
        const lottoNumbers = [];
        // A그룹에서 4개 뽑기
        while (lottoNumbers.length < 4) {
            const number = getRandomNumberFromGroup(weightedGroupA);
            if (!lottoNumbers.includes(number)) {
                lottoNumbers.push(number);
            }
        }
        // B그룹에서 2개 뽑기
        while (lottoNumbers.length < 6) {
            const number = getRandomNumberFromGroup(weightedGroupB);
            if (!lottoNumbers.includes(number)) {
                lottoNumbers.push(number);
            }
        }
        return lottoNumbers.sort((a, b) => a - b);
    };

    // 상태: 로또 번호 및 시뮬레이션 결과
    const [lottoNumbers, setLottoNumbers] = useState(generateLottoNumbers());
    const [simulationResults, setSimulationResults] = useState(null);

    // 새로운 번호 생성 (기존 방식)
    const handleGenerateLottoNumbers = () => {
        const newLottoNumbers = generateLottoNumbers();
        setLottoNumbers(newLottoNumbers);
        onHighlightedNumbers(newLottoNumbers);
    };

    // 3A+3B 번호 생성
    const handleGenerate3A3B = () => {
        const newLottoNumbers = generate3A3B();
        setLottoNumbers(newLottoNumbers);
        onHighlightedNumbers(newLottoNumbers);
    };

    // 4A+2B 번호 생성
    const handleGenerate4A2B = () => {
        const newLottoNumbers = generate4A2B();
        setLottoNumbers(newLottoNumbers);
        onHighlightedNumbers(newLottoNumbers);
    };

    // 1만회 시뮬레이션 함수
    const runSimulation = () => {
        const simCount = 10000;
        const frequency = {};
        for (let i = 1; i <= 45; i++) {
            frequency[i] = 0;
        }
        for (let i = 0; i < simCount; i++) {
            const numbers = generateLottoNumbers();
            numbers.forEach(num => {
                frequency[num]++;
            });
        }
        const totalNumbers = simCount * 6;
        const results = Object.keys(frequency).map(num => ({
            number: Number(num),
            count: frequency[num],
            percentage: ((frequency[num] / totalNumbers) * 100).toFixed(2),
        })).sort((a, b) => b.percentage - a.percentage || a.number - b.number);
        setSimulationResults(results);
    };

    return (
        <div>
            <h2>랜덤 로또 번호</h2>
            <div>
                <button onClick={handleGenerateLottoNumbers} style={{ margin: '10px' }}>
                    비율 별 랜덤 뽑기
                </button>
                <button onClick={handleGenerate3A3B} style={{ margin: '10px' }}>
                    3A+3B 뽑기
                </button>
                <button onClick={handleGenerate4A2B} style={{ margin: '10px' }}>
                    4A+2B 뽑기
                </button>
                <button onClick={runSimulation} style={{ margin: '10px' }}>
                    1만회 시뮬레이션
                </button>
            </div>
            <div>
                {lottoNumbers.map((num, index) => (
                    <span key={index} style={{ margin: '0 10px' }}>
                        <img
                            src={`https://www.lotto.co.kr/resources/images/lottoball_92/on/${num}.png`}
                            alt={`Number ${num}`}
                            style={{ width: '40px', height: '40px', marginBottom: '5px' }}
                        />
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
                                <img
                                    src={`https://www.lotto.co.kr/resources/images/lottoball_92/on/${number}.png`}
                                    alt={`Number ${number}`}
                                    style={{ width: '40px', height: '40px', marginBottom: '5px' }}
                                /><br />
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