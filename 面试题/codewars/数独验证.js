function validSolution(board) {
    // 获取九宫格
    const nineArr = new Array(9).fill(1).map(p => []);
    const numMap = {
        0: 0,
        1: 0,
        2: 0,
        3: 1,
        4: 1,
        5: 1,
        6: 2,
        7: 2,
        8: 2
    };
    
    board.forEach((oneArr, index) => {
        if (index <= 2) {
            console.log('1',index);
            nineArr[0].push(...oneArr.slice(0,3));
            nineArr[1].push(...oneArr.slice(3,6));
            nineArr[2].push(...oneArr.slice(6,9));
        }

        if (index > 2 && index <= 5) {
            console.log('2', index);
            nineArr[3].push(...oneArr.slice(0,3));
            nineArr[4].push(...oneArr.slice(3,6));
            nineArr[5].push(...oneArr.slice(6,9));
        }

        if (index > 5) {
            console.log('3', index);
            nineArr[6].push(...oneArr.slice(0,3));
            nineArr[7].push(...oneArr.slice(3,6));
            nineArr[8].push(...oneArr.slice(6,9));
        }

        // oneArr.forEach((twoArr, idx) => {
        //     if (index <= 2) {
        //         console.log('1',index);
        //         nineArr[numMap[idx]].push(twoArr);
        //     }

        //     if (index > 2 && index <= 5) {
        //         console.log('2', index);
        //         nineArr[numMap[idx]+3].push(twoArr);
        //     }

        //     if (index > 5) {
        //         console.log('3', index);
        //         nineArr[numMap[idx]+6].push(twoArr);
        //     }
        // });
    });

    console.log("九个格子", nineArr);

    return false;
}


validSolution([
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    // ----
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    // ----
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
]); 