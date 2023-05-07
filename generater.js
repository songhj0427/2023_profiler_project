const fs = require("fs");

// 랜덤한 값을 생성하는 함수
function getRandomValue(min, max, isLarge) {
  let value = Math.floor(Math.random() * (max - min + 1)) + min;
  if (isLarge && Math.random() < 0.01) {
    value += Math.floor(Math.random() * 300) + 300;
  }
  return value;
}

const NUM_TABLES = 40; // 생성할 테이블 개수
const MIN_VALUE = {
  task1: 300,
  task2: 200,
  task3: 500,
  task4: 100,
  task5: 200,
}; // 최소값
const MAX_VALUE = {
  task1: 1000,
  task2: 900,
  task3: 1000,
  task4: 1100,
  task5: 1000,
}; // 최대값

// 테이블 생성 및 파일에 쓰기
let ret = "";
for (let i = 1; i <= NUM_TABLES; i++) {
  let table = "";
  table += "\ttask1\ttask2\ttask3\ttask4\ttask5\n"; // 열 이름 추가
  for (let j = 1; j <= 5; j++) {
    let row = `core${j}\t`;
    for (let k = 1; k <= 5; k++) {
      let value = getRandomValue(
        MIN_VALUE[`task${k}`],
        MAX_VALUE[`task${k}`],
        i % 10 === 0
      ); // 10번째 테이블마다 큰 값을 생성
      row += `${value}\t`;
    }
    table += `${row}\n`;
  }
  ret += `${table}\n`;
}
fs.writeFileSync(`test.txt`, ret);
