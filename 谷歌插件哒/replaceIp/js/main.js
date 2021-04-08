
(function () {

    function replaceMethod() {
        setTimeout(() => {
            const aArray = document.querySelectorAll('.content-wrapper a');
            const addCopy = document.querySelector("#http_project_clone");
            console.log("获取所有的a标签", addCopy);

            if (addCopy) addCopy.value = addCopy.value.replace(/^http:\/\/gitlab.yanhuamedical.com/, 'http://110.185.169.13:90');

            aArray.forEach(p => {
                if (/^http:\/\/gitlab.yanhuamedical.com/.test(p.href)) p.href = p.href.replace(/^http:\/\/gitlab.yanhuamedical.com/, '');
            });
        }, 500);
    }

    document.addEventListener('DOMContentLoaded', () => {
        console.log('我被执行了!');

        console.log('路由', window.location);

        const $location = new Proxy(window.location, )

        replaceMethod();

    });
}())
