// DeveloperLog.js
import React, { useState } from 'react';
import './DeveloperLog.css';

function DeveloperLog() {
    const [selectedResult, setSelectedResult] = useState(null);

    // 미리 계산된 샘플 결과 (개발자가 VS Code에서 추가)
    const sampleResults = [
        {
            drawNumber: 1175,
            userNumbers: [1, 2, 3, 4, 5, 6],
            winningNumbers: [1, 2, 3, 4, 5, 6],
            isWinner: true,
        },
        {
            drawNumber: 1174,
            userNumbers: [10, 20, 30, 40, 41, 42],
            winningNumbers: [1, 2, 3, 4, 5, 6],
            isWinner: false,
        },
    ];

    const handleSelectResult = (index) => {
        setSelectedResult(sampleResults[index]);
    };

    return (
        <div className="dev-container">
            <h2>개발자 기록</h2>
            <div className="dev-panel result">
                {sampleResults.map((result, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelectResult(index)}
                        style={{ margin: '5px', padding: '10px' }}
                    >
                        회차 {result.drawNumber} 확인
                    </button>
                ))}
            </div>
            {selectedResult && (
                <div className="dev-panel result">
                    <h3>결과: {selectedResult.isWinner ? '당첨!' : '낙첨'}</h3>
                    <p>회차: {selectedResult.drawNumber}</p>
                    <p>당신의 번호: {selectedResult.userNumbers.join(', ')}</p>
                    <p>당첨 번호: {selectedResult.winningNumbers.join(', ')}</p>
                </div>
            )}
        </div>
    );
}

export default DeveloperLog;