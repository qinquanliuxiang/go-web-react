//  新窗口打开路由的通用解决方案
//  @param path 需要打开的路径（支持带参数格式）
//  @param isHashRouter 是否使用 HashRouter（默认 false）
//  使用示例：
//  // BrowserRouter 方式
//  openNewWindow('/user/123?name=abc')
//  // HashRouter 方式
//  openNewWindow('/user/123?name=abc', true)
export const openNewWindow = (path: string, isHashRouter = false) => {
  // 处理不同路由模式
  const fullPath = isHashRouter
    ? `${window.location.origin}/#${path}`
    : `${window.location.origin}${path}`;

  // 创建新窗口（建议在同步代码中打开避免被拦截）
  const newWindow = window.open("", "_blank");

  if (newWindow) {
    // 直接跳转
    newWindow.location.href = fullPath;
  } else {
    console.error("弹窗被浏览器拦截，请允许弹窗或手动复制链接打开");
    // 备用方案：展示可复制的链接
    prompt("弹窗被拦截，请手动复制链接", fullPath);
  }
};
