{   

    const fs = require('fs')

}

{   
    // 数据有可能没有 ；分号，还有可能 对子不同
    const momo = ['C9D7D9S7D2;HAC5S8D8C10', 'DQSJD8C4DA;H3C9H7D6S2', 'S5HAHJS9DQ;D3S7C6D6S3'];
    
    // 能被10整除的数
    const divisible = [];
    
    function init(data) {
        const collectArr = data.match(/[SHCD][\dAJQK]/g);

        if (collectArr.length !== 10 || !data.includes(";")) { return console.log('这个记录是无效的', data); }

        let Leon = collectArr.slice(0, 5).map(p => ({ card: p[1], colours: p[0] }));
        let Judy = collectArr.slice(5, 10).map(p => ({ card: p[1], colours: p[0] }));

        console.log('两位选手的牌', Leon, Judy);

        
    }

    init(momo[0]);

    function identify(data) {
        data.forEach((p, index) => {
            
        });
    }

    function score(data) {
        
    }
}