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
			chrome.action.setPopup({ popup: "" });
			this.myTab = null;
		}
	}
	updateHandler(updatedTabId, changeInfo, tab) {
		if (
			updatedTabId == this.myTab.id &&
			changeInfo.audible == undefined &&
			changeInfo.title == undefined &&
			changeInfo.favIconUrl == undefined
		) {
			this._executeContentScript();
		}
	}
	sender() {
		if (this.myTab != null) {
			setInterval(() => {
				chrome.tabs.update(this.myTab.id, {});
				// chrome.runtime.sendMessage({ message: "", myTab: this.myTab.id });
			}, 4000);
		}
	}

	attachListeners() {
		chrome.action.onClicked.addListener(() => {
			this._updateMyTab();
		});
		chrome.tabs.onRemoved.addListener((removedTabId) => {
			if (this.myTab != null) this.removeHandler(removedTabId);
		});
		chrome.tabs.onUpdated.addListener((updatedTabId, changeInfo, tab) => {
			if (this.myTab != null) this.updateHandler(updatedTabId, changeInfo, tab);
		});
		chrome.runtime.onMessage.addListener((message, sender) => {
			switch (message.message) {
				case "getFullPage":
					chrome.tabs.sendMessage(this.myTab.id, { message: "getFullPage" });
					break;
				case "playBtnClicked":
					chrome.tabs.sendMessage(this.myTab.id, { message: "playBtnClicked" });
					break;
				case "nextBtnClicked":
					chrome.tabs.sendMessage(this.myTab.id, { message: "nextBtnClicked" });
					break;
				case "prevBtnClicked":
					chrome.tabs.sendMessage(this.myTab.id, { message: "prevBtnClicked" });
					break;
				case "progressClicked":
					chrome.tabs.sendMessage(this.myTab.id, message);
					break;
				case "statisticsBtnClicked":
					chrome.tabs.sendMessage(this.myTab.id, {
						message: "statisticsBtnClicked",
					});
					break;
				case "progress":
					break;
				default:
					console.log("some message in background now", message);
			}
		});
	}
}
const targetUrl = "https://music.yandex.ru/*";
const popupUrl =
	"chrome-extension://oheahanbejjcfjnempoejfankcopkepk/popup/popup.html";
const tabManager = new TabManager(targetUrl, popupUrl);
tabManager.attachListeners();
