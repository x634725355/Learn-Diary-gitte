

module.exports = function ({ types }) {
    return {
        visitor: {
            Program: {
                enter(path, { opts = {} }) {
                    console.log('这是什么东西呢');
                },
            },
            // PropertySignature: {
            //     enter(path, state) {
            //         const { node } = path;
            //         console.log('type', node.type);
            //     }
            // }
            Identifier(path, state) {
                console.log('mo')
            }
        },
    };
};

