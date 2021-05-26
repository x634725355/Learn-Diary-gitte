let num = 3920;

let start = 0;
let end = 0;

let arr = []

for (let index = 1; index <= num; index++) {
  if (index % 100 === 0 || index === num) {
    end = index;
    arr.push([start, end])
    start = index;
  }
}

console.log('最终答案', arr);

