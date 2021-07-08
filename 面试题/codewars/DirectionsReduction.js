// NORTH 北 SOUTH 南 EAST 东 WEST 西
const map = {
    'NORTH': 'SOUTH',
    'SOUTH': 'NORTH',
    'EAST': 'WEST',
    'WEST': 'EAST',
    undefined: 'go die'
};

function dirReduc(arr) {
    // start
    for (let index = 0; index <= arr.length; index++) {
        let element = arr[index];
        let nextElement = arr[index + 1];

        if (element === map[nextElement]) {
            arr.splice(index, 2);
            break;
        }

        if (index >= arr.length) {
            return arr;
        }
    }

    return dirReduc(arr);
}



console.log('result1', dirReduc(["NORTH", "SOUTH", "SOUTH", "EAST", "WEST", "NORTH", "WEST"]));
console.log('result2', dirReduc(["NORTH", "WEST", "SOUTH", "EAST"]));
console.log('result3', dirReduc(["NORTH", "SOUTH", "EAST", "WEST", "EAST", "WEST"]));
