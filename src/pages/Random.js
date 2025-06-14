import React, { useState } from 'react';
import './Random.css'; // 스타일 파일 추가 (아래에 정의)

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
        while (lottoNumbers.length < 3) {
            const number = getRandomNumberFromGroup(weightedGroupA);
            if (!lottoNumbers.includes(number)) {
                lottoNumbers.push(number);
            }
        }
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
        while (lottoNumbers.length < 4) {
            const number = getRandomNumberFromGroup(weightedGroupA);
            if (!lottoNumbers.includes(number)) {
                lottoNumbers.push(number);
            }
        }
        while (lottoNumbers.length < 6) {
            const number = getRandomNumberFromGroup(weightedGroupB);
            if (!lottoNumbers.includes(number)) {
                lottoNumbers.push(number);
            }
        }
        return lottoNumbers.sort((a, b) => a - b);
    };

    // 상태: 로또 번호
    const [lottoNumbers, setLottoNumbers] = useState(generateLottoNumbers());

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

    return (
        <div className="random-container">
            
            <img src={`${process.env.PUBLIC_URL}/LottoMachine.png`} alt="LottoMachine" className="LottoMachine"/>
            <div className="button-group">
                <button onClick={handleGenerateLottoNumbers} className="random-button">
                    비율 별 랜덤 뽑기
                </button>
                <button onClick={handleGenerate3A3B} className="random-button">
                    3A+3B 뽑기
                </button>
                <button onClick={handleGenerate4A2B} className="random-button">
                    4A+2B 뽑기
                </button>
            </div>
            <div className="number-display">
                {lottoNumbers.map((num, index) => (
                    <span key={index} className="lotto-number">
                        <img
                            src={`https://www.lotto.co.kr/resources/images/lottoball_92/on/${num}.png`}
                            alt={`Number ${num}`}
                            className="lotto-ball"
                        />
                    </span>
                ))}
            </div>
        </div>
    );
}

export default Random;