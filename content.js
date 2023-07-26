/*
	СЛОВАРИК message:
	getFullPage = все элементы(popup открыт){trackName, imgSrc, trackArtists, progressTranslate}
*/

console.error = function () {};
console.warn = function () {};
console.info = function () {};

// ПРобуем ООП
console.log(123);
class MyTrackManager {
	constructor() {
		this.trackName = null;
		this.trackArtists = null;
		this.imgSrc = null;
		this.playBtnSrc = null;
		this.progress = null;
		this.setFullPage();
		this.sendMessageToPopup({
			message: "fullPage",
			trackArtists: this.trackArtists,
			trackName: this.trackName,
			imgSrc: this.imgSrc,
			playBtnSrc: this.playBtnSrc,
		});
	}
	setFullPage() {
		this.trackName = document.querySelector(".track__title").textContent;
		this.trackArtists = document.querySelector(".track__artists").textContent;
		this.imgSrc = document.querySelector(
			".player-controls__track .entity-cover__image.deco-pane"
		).src;
		this.playBtnSrc = document.querySelector(
			".bar__content .d-icon_play"
		).style.backgroundImage;
		this.getPlayBtn();
		this.getProgress();
		console.log("setFullPage done");
	}
	attachListeners() {
		chrome.runtime.onMessage.addListener((message, sender) => {
			//проверка сообщения и отправка ответа
			switch (message.message) {
				case "getFullPage":
					this.setFullPage();
					this.sendMessageToPopup({
						message: "fullPage",
						trackArtists: this.trackArtists,
						trackName: this.trackName,
						imgSrc: this.imgSrc,
						playBtnSrc: this.playBtnSrc,
						progress: this.progress,
					});
					break;
			}
		});
	}
	getProgress() {
		this.progress = parseFloat(
			document
				.querySelector(".progress__line__branding")
				.style.transform.slice(11, -2)
		);
	}
	getPlayBtn() {
		if (document.querySelector(".player-controls__btn_pause") != null)
			this.playBtnSrc = "icons/pause.svg";
		else this.playBtnSrc = "icons/play.svg";
	}
	sendMessageToPopup(parameters) {
		chrome.runtime.sendMessage(parameters);
	}
}
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
let barObserver = new MutationObserver((mutationList) => {
	for (let mutation of mutationList) {
		if (mutation.type === "attributes") {
			// Проверяем, что элемент имеет класс "progress"
			if (mutation.target.classList.contains("progress__line__branding")) {
				if (mutation.target.style.transform != NaN) {
					translate = parseFloat(mutation.target.style.transform.slice(11, -2));
					chrome.runtime.sendMessage({
						message: "progress",
						progress: translate,
					});
				}
			}
		}
	}
});

if (
	document.querySelectorAll(".track__title").length > 0 &&
	document.querySelectorAll(".track__artists").length > 0 &&
	document.querySelectorAll(
		".player-controls__track .entity-cover__image.deco-pane"
	).length > 0
) {
	const trackManager = new MyTrackManager();
	trackManager.attachListeners();
} else {
	const observer = new MutationObserver(checkForElements);
	observer.observe(document.body, { childList: true, subtree: true });

	function checkForElements() {
		if (
			document.querySelectorAll(".track__title").length > 0 &&
			document.querySelectorAll(".track__artists").length > 0 &&
			document.querySelectorAll(
				".player-controls__track .entity-cover__image.deco-pane"
			).length > 0
		) {
			observer.disconnect();
			const trackManager = new MyTrackManager();
			trackManager.attachListeners();
		}
	}
}

barObserver.observe(document.querySelector(".bar__content"), {
	subtree: true,
	attributes: true,
});
