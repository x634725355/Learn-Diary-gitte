let num = 0;

function lili() {
    return new Promise((resolve, reject) => {
        if (num === 5) resolve('success');
        if (num === 9) reject('fail');
    });
}

num = 9;

async function kaka() {
    try {
        console.log('momo', num);
        const result = await lili();
        console.log('this is', result);
    } catch (error) {
        console.log('this is error', error);
    }
}

kaka();
