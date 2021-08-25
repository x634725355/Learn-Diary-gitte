const healperImport = require('@babel/helper-module-imports');

const ImportPlugin = {
    // 从webpack配置进Program钩子函数读取libName和libDir
    libName: '',
    libDir: '',
    // helper-module-imports待引入的组件都放在这里
    toImportQueue: [],
    // helper-module-imports引入过的组件都放在这里
    importedQueue: {},
    // helper-module-imports替换原始import
    import(path, file, name) {
        const imported = healperImport.addDefault(file.path, `${this.libName}/${this.libDir}/${this.toImportQueue[name]}/style/index`);

        return imported;
    },
};

function transCamel(_str, symbol) {
    const str = _str[0].toLowerCase() + _str.substr(1);
    return str.replace(/([A-Z])/g, $1 => `${symbol}${$1.toLowerCase()}`);
}

module.exports = function ({ types }) {
    return {
        visitor: {
            // Program钩子函数主要接收webpack的参数
            Program: {
                enter(path, { opts = {} }) {
                    ImportPlugin.libName = opts.libName;
                    ImportPlugin.libDir = opts.libDir;
                },
            },
            // ImportDeclaration钩子函数主要处理import之类的源码
            ImportDeclaration: {
                enter(path, state) {
                    const { node, hub: { file } } = path;
                    if (!node) return;
                    const { value } = node.source;
                    if (value === ImportPlugin.libName) {
                        node.specifiers.forEach(spec => {
                            ImportPlugin.toImportQueue[spec.local.name] = transCamel(spec.local.name, '-');

                            ImportPlugin.import(path, file, spec.local.name);
                        });
                    }
                },
            },
            Identifier(path, state) {

            },
        },
    };
};