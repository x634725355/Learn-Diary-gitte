const numMap = {
    '0': 'zero',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine'
}
// 单数是大写开始 双数是小写开始
let convert = (str, index, isEven) => {
    let enNum = numMap[str];
    let string = '';
    if (isEven) {
        for (let index = 0; index < 5; index ++) {
            string = string + (index % 2 ? enNum.toLowerCase() : enNum.toUpperCase());
        }
    } else {
        for (let index = 0; index < 5; index ++) {
            string = string + (index % 2 ? enNum.toUpperCase() : enNum.toLowerCase());
        }
    }

    console.log('momo', string, index, string.slice(0, index + 1));

    return string.slice(0, index + 1);
}

function conv(num) {
    // Good luck :)
    let str = num + "";
    let arrStr = str.split("");
    let length = str.length;
    let isEven = length % 2;
    if (isEven) {
        for (let index = 0; index < length; index++) {
            const element = str[index];
            if (element % 2) {
                arrStr[index] = convert(element, index, isEven); 
            }
        }
    } else {
        for (let index = 0; index < length; index++) {
            const element = str[index];
            if (!(element % 2)) {
                arrStr[index] = convert(element, index, isEven); 
            }
        }
    }

    return arrStr.join("");
}


console.log('1', conv(47309534));   