if (!Function.prototype.softBind) {
    Function.prototype.softBind = function (obj) {
        let fn = this;
        // 捕获所有 curried 参数
        let curried = [].slice(arguments, 1);
        let bound = function () {
            return fn.apply(
                (!this || this === (window || global)) ?
                    obj : this,
                curried.concat.apply(curried, arguments)
            );
        };
        bound.prototype = Object.create(fn.prototype);
        return bound;
    };
}
