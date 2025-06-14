import React, { useState } from 'react';
import LottoData from './LottoData';
import Random from './Random';
import './LottoPick.css';

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
        <div>
            <div className="main-container">
                <div className="left-panel"> {/*번호별 당첨 횟수 */}
                    <h2>로또 번호별 1등 당첨 횟수</h2>
                    <div className="sort-buttons">
                        <button
                            onClick={() => setSortBy('number')}
                            className={sortBy === 'number' ? 'active' : ''}
                        >
                            번호 순 정렬
                        </button>
                        <button
                            onClick={() => setSortBy('count')}
                            className={sortBy === 'count' ? 'active' : ''}
                        >
                            당첨 횟수 순 정렬
                        </button>
                        <span className="group-info">
                            ※당첨횟수가 많은 그룹을 A그룹(파란색), 횟수가 적은 그룹을 B그룹(회색)으로 분류
                        </span>
                        <br></br>
                        <br></br>
                        <span>역대 로또 당첨번호들의 A,B그룹의 조합 : </span>
                        <span>
                            0A+6B: 7회,
                            1A+5B: 52회,
                            2A+4B: 205회,
                            3A+3B: 361회,
                            4A+2B: 347회,
                            5A+1B: 166회,
                            6A+0B: 31회
                        </span>
                    </div>
                    <div className="number-grid">
                        {sortedNumbers.map(({ number, count, percentage }) => (
                            <div
                                key={number}
                                className={`number-item ${highlightedNumbers.includes(number)
                                        ? 'highlighted'
                                        : groupA.has(number)
                                            ? 'group-a'
                                            : 'group-b'
                                    }`}
                            >
                                <img
                                    src={`https://www.lotto.co.kr/resources/images/lottoball_92/on/${number}.png`}
                                    alt={`Number ${number}`}
                                    className="lotto-ball"
                                />
                                <br />
                                {count}회<br />
                                ({percentage}%)
                            </div>
                        ))}
                    </div>
                </div>

                <div className="right-panel"> {/* 오른쪽: 랜덤 번호 뽑기 */}
                    <Random onHighlightedNumbers={handleHighlightedNumbers} />
                </div>
            </div>
        </div>
    );
}

export default LottoPick;