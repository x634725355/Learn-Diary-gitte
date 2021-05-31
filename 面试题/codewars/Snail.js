
const array = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

const array1 = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]]

const snail = (array) => {
  // y轴长度
  let yLength = array.length;
  // x轴长度
  let xLength = array[0].length;
  // 向左走时候 的边界值
  let leftBoundary = 0;
  // 向上走时候 的边界值
  let upBoundary = 0;
  // 要循环的次数
  const count = yLength * xLength;
  // 行走的方向
  let direction = 'right';
  // 展开的数组
  const arrOpen = [];
  // 起始坐标
  let x = 0, y = 0;

  for (let index = 0; index < count; index++) {
    arrOpen.push(array[y][x]);

    switch (direction) {
      case 'right':
        if (x >= xLength - 1) {
          console.log('到顶了 要改变状态了 此时的xy', x, y, '此时的状态', direction);
          xLength--;
          direction = 'down';
          y++;
          break;
        }
        x++;
        break;
      case 'down':
        if (y >= yLength - 1) {
          console.log('到顶了 要改变状态了 此时的xy', x, y, '此时的状态', direction);
          yLength--;
          direction = 'left';
          x--;
          break;
        }
        y++;
        break;
      case 'left':
        if (x === leftBoundary) {
          console.log('到顶了 要改变状态了 此时的xy', x, y, '此时的状态', direction);
          upBoundary++;
          direction = 'up';
          y--;
          break;
        }
        x--;
        break;
      case 'up':
        if (y === upBoundary) {
          console.log('到顶了 要改变状态了 此时的xy', x, y, '此时的状态', direction);
          leftBoundary++;
          direction = 'right';
          x++;
          break;
        }
        y--;
        break;
      default:
        break;
    }

  }

  return arrOpen;
}

console.log('让我康康', snail(array1));

