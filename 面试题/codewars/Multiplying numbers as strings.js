function multiply(a, b) {
  let aLenth = a.length;
  let bLenth = b.length;
  let sumArray = [];
  
  for(let i=0; i < aLenth; i++) {
    let aNum = a[i];
    let aBit = aLenth - i -1;
    for (let k=0; k < bLenth; k++) {
      let bNum = b[k];
      let bBit = bLenth - k - 1;
      let sum = aNum * bNum + '';
      let temporaryArr = [];
      if (sum.length > 1) {
        temporaryArr[aBit + bBit + 1] = sum[0];
        temporaryArr[aBit + bBit] = sum[1];
      } else {
        temporaryArr[aBit + bBit] = sum[0];
      }
      // if (i === 0) {
      //   console.log('kaka', temporaryArr);
      // }
      temporaryArr.forEach((p, index) => {
        let sumIndex = sumArray[index] === undefined ? 0 : sumArray[index] * 1;
        let sumIndexAdd1 = sumArray[index + 1] === undefined ? 0 : sumArray[index + 1] * 1;
        let sum = (sumIndex + p * 1) + '';
        if (sum.length > 1) {
          sumArray[index + 1] = (sumIndexAdd1 + 1) + '';
          sumArray[index] = (sum[1] * 1) + '';
        } else {
          sumArray[index] = (sum * 1) + '';
        }
        // if (i === 0) {
        //   console.log('koko', sumArray);
        // }
      });
    }
  }
  
  console.log('moo', sumArray);
}

multiply("98765", "56894");