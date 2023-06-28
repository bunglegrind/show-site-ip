'use strict';

const tabs = {};

function update(details, event) {
	const tabId = details.tabId;
	if (!(tabId in tabs)) {
		tabs[tabId] = { onResponseStarted: null, onCommitted: null };
	}
	const tab = tabs[tabId];
	tab[event] = details;
	if (tab.onCommitted && tab.onResponseStarted === null) {
		chrome.pageAction.setIcon({ tabId: tabId, path: 'icons/no-ip.svg' });
	} else if (tab.onCommitted && tab.onResponseStarted) {
		if (tab.onResponseStarted.timeStamp >= tab.onCommitted.timeStamp) return;
		if (tab.onResponseStarted.proxyInfo !== null) {
			chrome.pageAction.setIcon({ tabId: tabId, path: 'icons/no-ip.svg' });
			chrome.pageAction.setTitle({ tabId: tabId, title: chrome.i18n.getMessage('through_proxy') });
		} else if (tab.onResponseStarted.ip !== null && tab.onResponseStarted.fromCache === false) {
			chrome.pageAction.setIcon({ tabId: tabId, path: 'icons/ip.svg' });
			chrome.pageAction.setTitle({ tabId: tabId, title: tab.onResponseStarted.ip });
			setTimeout(() => chrome.tabs.sendMessage(tabId, {ip: tab.onResponseStarted.ip}, function () {
				if (chrome.runtime.lastError) {
					return console.log(chrome.runtime.lastError);
				}
			}), 2000);
		//} else if (tab.onResponseStarted.ip !== null && tab.onResponseStarted.fromCache == true || // 304 Not Modified
		//	tab.onResponseStarted.ip === null && tab.onResponseStarted.fromCache == true || // bfcache
		//	tab.onResponseStarted.ip === null && tab.onResponseStarted.fromCache == false) { // bug
		} else {
			chrome.pageAction.setIcon({ tabId: tabId, path: 'icons/no-ip.svg' });
			chrome.pageAction.setTitle({ tabId: tabId, title: chrome.i18n.getMessage('from_cache') });
		}
		delete tabs[tabId];
	}
}

chrome.webRequest.onResponseStarted.addListener(
	(details) => {
		update(details, 'onResponseStarted');
	},
	{
		urls: ['http://*/*', 'https://*/*'],
		types: ['main_frame']
	}
);

chrome.webNavigation.onCommitted.addListener(
	(details) => {
		if (details.frameId !== 0) return;
		update(details, 'onCommitted');
	},
	{
		url: [
			{
				schemes: ['http', 'https']
			}
		]
	}
);

chrome.tabs.onRemoved.addListener((tabId) => {
	delete tabs[tabId];
});

chrome.pageAction.onClicked.addListener((tab) => {
	chrome.pageAction.getTitle({ tabId: tab.id }).then((title) => {
		navigator.clipboard.writeText(title)
	});
});
