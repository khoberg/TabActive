var shift;

chrome.runtime.onMessage.addListener(function (message) {
    shift = message.shift;
});

chrome.tabs.onCreated.addListener(function (newTab) {
    const newTabUrl = newTab.url !== '' ? newTab.url : newTab.pendingUrl;
    if (newTabUrl == 'chrome://newtab/') {
        return;
    }
    if (typeof newTab.openerTabId == 'undefined') {
        chrome.bookmarks.search(newTabUrl, function (bookmarks) {
            if (bookmarks.length > 0) {
                chrome.tabs.update(newTab.id, {
                    active: true
                });
            }
        });
        return;
    }
    if (!shift) {
        chrome.tabs.get(newTab.openerTabId, function (oldTab) {
            chrome.tabs.move(newTab.id, {
                index: oldTab.index + 1
            });
        });
        chrome.tabs.update(newTab.id, {
            active: true
        });
    } else {
        chrome.tabs.move(newTab.id, {
            index: -1
        });
        chrome.tabs.update(newTab.openerTabId, {
            active: true
        });
    }
});