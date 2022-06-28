// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(() => {
	console.log("CLICKED");
	// Send a message to the active tab
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (tabs && tabs.length > 0) {
			var activeTab = tabs[0]
			chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action" })
		}
	})
})

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
	if (request && request.message === 'version') {
		const manifest = chrome.runtime.getManifest()
		sendResponse({
			type: 'success',
			version: manifest.version
		})
		return true
	}
	const sources = request.sources
	const tab = sender.tab
	chrome.desktopCapture.chooseDesktopMedia(sources, tab, streamId => {
		// result of selecting desktop
	})
	return true
})

chrome.runtime.onMessage.addListener(function (request) {
	// if (request.scheme === 'dark') {
	// 	chrome.browserAction.setIcon({
	// 		path: {
	// 			"16": "favicon-48.png",
	// 			"32": "favicon-48.png",
	// 			"48": "favicon-48.png",
	// 			"128": "favicon-128.png",
	// 		}
	// 	})
	// } else {
	// 	chrome.browserAction.setIcon({
	// 		path: {
	// 			"16": "favicon-light-48.png",
	// 			"32": "favicon-light-48.png",
	// 			"48": "favicon-light-48.png",
	// 			"128": "favicon-light-128.png",
	// 		}
	// 	})
	// }
})

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
	// chrome.runtime.sendMessage({ scheme: 'dark' })
	chrome.browserAction.setIcon({
		path: {
			"16": "fav-48.png",
			"32": "fav-48.png",
			"48": "fav-48.png",
			"128": "fav-128.png",
		}
	})
}

if (window.matchMedia('(prefers-color-scheme: light)').matches) {
	// chrome.runtime.sendMessage({ scheme: 'light' })
	chrome.browserAction.setIcon({
		path: {
			"16": "fav-48.png",
			"32": "fav-48.png",
			"48": "fav-48.png",
			"128": "fav-128.png",
		}
	})
}

// chrome.webNavigation.onCompleted.addListener(function (details) {
// 	chrome.tabs.executeScript(details.tabId, { file: 'password-auto-fill.js' })
// })

let tabUrl = null
chrome.tabs.onActivated.addListener(function (activeInfo) {
	// how to fetch tab url using activeInfo.tabid
	setTimeout(() => {
		chrome.tabs.get(activeInfo.tabId, function (tab) {
			if (tab && tabUrl !== tab.url) {
				tabUrl = tab.url
				chrome.tabs.sendMessage(tab.id, { "message": "tab_loaded" })
			}
		})
	}, 100)
});

chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
	chrome.tabs.sendMessage(tabID, { "message": "tab_loaded" })
})