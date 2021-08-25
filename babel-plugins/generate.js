

module.exports = function ({ types }) {
    return {
        visitor: {
            // Program钩子函数主要接收webpack的参数
            Program: {
                enter(path, { opts = {} }) {
                    console.log('开始行动');
                },
            },
            // ImportDeclaration钩子函数主要处理import之类的源码
            ImportDeclaration: {
                enter(path, state) {
                },
            },
            Identifier(path, state) {

            },
        },
    };
};