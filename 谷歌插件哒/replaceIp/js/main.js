
(function () {

    function replaceMethod() {
        setTimeout(() => {
            const aArray = document.querySelectorAll('.content-wrapper a');
            const addCopy = document.querySelector("#http_project_clone");
            console.log("获取所有的a标签", aArray);

            if (addCopy) addCopy.value = addCopy.value.replace(/^http:\/\/192.168.60.3:8000/, 'http://118.122.250.104:9090');

            aArray.forEach(p => {
                if (/^http:\/\/192.168.60.3:8000/.test(p.href)) p.href = p.href.replace(/^http:\/\/192.168.60.3:8000/, '');
            });
        }, 500);
    }

    function overwriteHistory() {
        const newPushState = history.pushState;
        const newReplaceState = history.replaceState;
        const newGo = history.go;
        const newBack = history.back;

        history.pushState = function (...args) {
            console.log("监听路由变化 pushState");
            newPushState.call(this, ...args);
        }
        history.replaceState = function (...args) {
            console.log("监听路由变化 replaceState");
            newReplaceState.call(this, ...args);
        }
        history.go = function (...args) {
            console.log("监听路由变化 go");
            newGo.call(this, ...args);
        }
        history.back = function (...args) {
            console.log("监听路由变化 back");
            newBack.call(this, ...args);
        }
    }


    document.addEventListener('DOMContentLoaded', () => {
        console.log('我被执行了!');
        // overwriteHistory();

        document.addEventListener('click', (e) => {
            setTimeout(() => {
                replaceMethod();
            }, 1000)
            // queueMicrotask(() => {
            //     replaceMethod();
            // })
        });

        replaceMethod();

    });
}())
