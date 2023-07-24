// const targetUrl = "https://music.yandex.ru/*";
// let myTab;
// let status = false;
// async function updateMyTab() {
// 	let tabs;
// 	tabs = await chrome.tabs.query({ url: targetUrl });

// 	if (tabs.length > 0) {
// 		myTab = tabs[0];
// 	} else {
// 		await chrome.tabs.create({
// 			url: "https://music.yandex.ru/home",
// 			pinned: true,
// 		});
// 		tabs = await chrome.tabs.query({ url: targetUrl });
// 		myTab = tabs[0];
// 	}
// 	await chrome.tabs.update(myTab.id, { active: true, pinned: true });
// 	chrome.scripting.executeScript({
// 		target: { tabId: myTab.id },
// 		files: ["content.js"],
// 	});

// 	chrome.action.setPopup({ popup: "popup/popup.html" });

// 	// var port = chrome.tabs.connect(myTab.id, { name: "knockknock" });
// 	// port.postMessage({ joke: "Knock knock" });
// 	// port.onMessage.addListener(function (msg) {
// 	// 	if (msg.question === "Who's there?") port.postMessage({ answer: "Madame" });
// 	// 	else if (msg.question === "Madame who?")
// 	// 		port.postMessage({ answer: "Madame... Bovary" });
// 	// });
// }

// chrome.action.onClicked.addListener(updateMyTab);
// chrome.tabs.onRemoved.addListener((removedTabId) => {
// 	if (removedTabId == myTab.id) chrome.action.setPopup({ popup: "" });
// });

//пробуем в ООП стиле
class TabManager {
	constructor(targetUrl, popupUrl) {
		this.targetUrl = targetUrl;
		this.myTab = null;
		this.popupUrl = popupUrl;
	}
	_executeContentScript() {
		chrome.scripting.executeScript({
			target: { tabId: this.myTab.id },
			files: ["content.js"],
		});
	}

	async _updateMyTab() {
		let tabs = await chrome.tabs.query({
			url: this.targetUrl,
			pinned: true,
			currentWindow: true,
		});
		if (tabs.length > 0) this.myTab = tabs[0];
		else {
			let newTab = await chrome.tabs.create({
				url: "https://music.yandex.ru/home",
				pinned: true,
			});
			this.myTab = newTab;
		}

		await chrome.tabs.update(this.myTab.id, { active: true, pinned: true });
		this._executeContentScript();
		chrome.action.setPopup({
			popup: this.popupUrl,
		});
		this.sender();
	}

	removeHandler(removedTabId) {
		if (removedTabId == this.myTab.id) {
			console.log("removed my tab");
			chrome.action.setPopup({ popup: "" });
			this.myTab = null;
		}
	}
	updateHandler(updatedTabId) {
		if (updatedTabId == this.myTab.id) {
			this._executeContentScript();
		}
	}
	sender() {
		setInterval(() => {
			chrome.runtime.sendMessage({ message: "", myTab: this.myTab.id });
		}, 1000);
	}

	attachListeners() {
		chrome.action.onClicked.addListener(() => {
			this._updateMyTab();
		});
		chrome.tabs.onRemoved.addListener((removedTabId) => {
			if (this.myTab != null) this.removeHandler(removedTabId);
		});
		chrome.tabs.onUpdated.addListener((updatedTabId) => {
			if (this.myTab != null) this.updateHandler(updatedTabId);
		});
		chrome.runtime.onMessage.addListener((message, sender) => {
			if (sender.url == this.popupUrl) {
				console.log("message from popup is being in background now");
				chrome.tabs.sendMessage(this.myTab.id, { message: "getFullPage" });
			}
		});
	}
}
const targetUrl = "https://music.yandex.ru/*";
const popupUrl =
	"chrome-extension://oheahanbejjcfjnempoejfankcopkepk/popup/popup.html";
const tabManager = new TabManager(targetUrl, popupUrl);
tabManager.attachListeners();
