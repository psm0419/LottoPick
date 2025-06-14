import cv2
import pytesseract
import numpy as np
from PIL import Image
import sys
import json

# 이미지 파일 경로 (Java에서 전달)
image_path = sys.argv[1]

# 이미지 로드 및 전처리
image = cv2.imread(image_path)
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
_, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

# 회차 및 번호 추출
text = pytesseract.image_to_string(thresh)
lines = text.split('\n')
draw_number = None
user_numbers = []

for line in lines:
    if "회차" in line:
        draw_number = int(''.join(filter(str.isdigit, line)))
    elif any(str(i) in line for i in range(1, 46)):
        numbers = [int(x) for x in line.split() if x.isdigit() and 1 <= int(x) <= 45]
        user_numbers.extend(numbers[:6])  # 최대 6개 번호

# 당첨 번호 데이터 (예: LottoData에서 가져옴)
winning_data = {
    1175: [1, 2, 3, 4, 5, 6],  # 예시 데이터, 실제로는 LottoData 사용
    # ... 다른 회차 데이터
}

# 당첨 여부 확인
is_winner = False
if draw_number in winning_data and len(user_numbers) == 6:
    is_winner = all(num in winning_data[draw_number] for num in user_numbers)

# 결과 반환
result = {
    "isWinner": is_winner,
    "drawNumber": draw_number,
    "winningNumbers": winning_data.get(draw_number, []),
    "userNumbers": user_numbers
}
print(json.dumps(result))