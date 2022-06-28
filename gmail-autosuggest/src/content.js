import { decoration } from './decoration'


require('dotenv').config()

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// console.log(request)
	if (request.message === "clicked_browser_action") { }

	if (request.message === "tab_loaded") {
		decoration.run()
	}
});

(function () {
	document.addEventListener('DOMContentLoaded', function () {
		decoration.run()
	})
})()