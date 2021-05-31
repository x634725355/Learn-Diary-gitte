
// #### new的时候 js做了什么

// 使用new 来调用函数, 或者说发生构造函数调用时, 会自动执行下面的操作
// 1. 创建(或者说构造)一个全新的对象
// 2. 这个新对象会被执行[[ 原型 ]]连接
// 3. 这个新对象会绑定到函数调用的this
// 4. 如果函数没有返回其他对象, 那么new表达式中的函数调用会自动返回这个新对象

function person(Con, ...args) {
    let obj = Object.create(Con.prototype);

    let result = Con.call(obj, ...args);

    return result instanceof Object ? result : obj;
}

