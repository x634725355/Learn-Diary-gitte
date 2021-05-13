let array = [
  [1, 4],
  [7, 10],
  [3, 5]
];

let array2 = [
  [4, 6],
  [10, 13],
  [1, 5],
  [5, 11]
];

/**
 * 
 * @param {Array} intervals 
 */
function sumIntervals(intervals) {
  let mergeArray = [];
  let singleArray = [];
  let length = intervals.length;
  
  for (let index = 0; index < length; index++) {
    const element = intervals[index] || [];
    for (let idx = index + 1; idx < length; idx++) {
      const nextElement = intervals[idx] || [];
      if (element[1] >= nextElement[0]) {
        let momo = element[0] > nextElement[0] ? [...nextElement, ...element] : [...element || [], ...nextElement || []] ;
        mergeArray.push(...momo);
        delete intervals[idx];
        delete intervals[index];
      } else {
        singleArray.push(nextElement);
      }
    }
  }

  return ;
}

console.log(sumIntervals(array));

