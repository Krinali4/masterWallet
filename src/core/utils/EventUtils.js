export function postAppMessage(msg) {
    if (window.webkit != undefined) {
        if (window.webkit.messageHandlers.LOQ8WebViewHandler != undefined) {
            window.webkit.messageHandlers.LOQ8WebViewHandler.postMessage(msg)
            return;
        }
    }
    if (window.LOQ8WebViewHandler != undefined) {
        window.LOQ8WebViewHandler.postMessage(msg)
        return;
    }
    window.parent.postMessage(msg, "*")
}