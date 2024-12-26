document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".sidebar");
    const content = document.querySelector(".content");
    const body = document.documentElement; // 页面滚动对象

    // 检测页面是否滚动到底部
    function isPageAtBottom() {
        return (
            window.innerHeight + window.scrollY >= document.body.offsetHeight
        );
    }

    // 当鼠标在目录区域滚动
    sidebar.addEventListener("wheel", (event) => {
        const delta = event.deltaY;
        sidebar.scrollTop += delta; // 目录滚动
        event.preventDefault(); // 阻止页面其他滚动
    });

    // 当鼠标在主要内容区域滚动
    content.addEventListener("wheel", (event) => {
        const delta = event.deltaY;
        content.scrollTop += delta; // 主要内容滚动
        sidebar.scrollTop += delta * 0.5; // 目录以较慢速度同步滚动
        event.preventDefault(); // 阻止页面其他滚动
    });

    // 当鼠标在页面的其他区域滚动
    document.addEventListener("wheel", (event) => {
        const delta = event.deltaY;

        if (!isPageAtBottom()) {
            // 页面未滚到底部时，页面正常滚动
            body.scrollTop += delta;
        } else {
            // 页面滚动到底后，目录和主要内容同步滚动
            sidebar.scrollTop += delta * 0.5; // 目录速度较慢
            content.scrollTop += delta; // 主要内容正常滚动
        }
        event.preventDefault(); // 阻止默认滚动行为
    });
});
