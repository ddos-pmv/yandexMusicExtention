/*
	СЛОВАРИК message:
	getFullPage = все элементы(popup открыт){trackName, imgSrc, trackArtists, progressTranslate}
*/
console.error = function () {};
// ПРобуем ООП
class MyTrackManager {
	constructor() {
		this.trackDuration = null;
		this.trackPlayedTime = null;
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
	}

	playBtnClicker() {
		document
			.querySelector(
				".player-controls__btn.deco-player-controls__button.player-controls__btn_play"
			)
			.click();
	}
	prevBtnClicker() {
		document
			.querySelector(
				".player-controls__btn.deco-player-controls__button.player-controls__btn_prev"
			)
			.click();
	}
	nextBtnClicker() {
		document
			.querySelector(
				".player-controls__btn.deco-player-controls__button.player-controls__btn_next"
			)
			.click();
	}
	progressClicker(newState) {
		let progressLine = document.querySelector(
			".player-progress.progress.deco-progress.progress_branding"
		);
		let tapX = parseInt(
			(progressLine.clientWidth / 100) * newState +
				(document.body.clientWidth - progressLine.clientWidth) / 2
		);
		let tapY = 865;
		console.log(
			progressLine.clientWidth,
			newState,
			tapX,
			(progressLine.clientWidth / 100) * newState
		);
		let event = new MouseEvent("mousedown", {
			composed: true,
			bubbles: true,
			cancelable: true,
			clientX: tapX,
		});
		let moveEvent = new MouseEvent("mousemove", {
			composed: true,
			bubbles: true,
			cancelable: true,
			clientX: tapX,
		});
		let upEvent = new MouseEvent("mouseup", {
			composed: true,
			bubbles: true,
			cancelable: true,
			clientX: tapX,
		});
		progressLine.dispatchEvent(event);
		progressLine.dispatchEvent(moveEvent);
		progressLine.dispatchEvent(upEvent);
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
				case "playBtnClicked":
					this.playBtnClicker();
					break;
				case "nextBtnClicked":
					this.nextBtnClicker();
					break;
				case "prevBtnClicked":
					this.prevBtnClicker();
					break;
				case "progressClicked":
					this.progressClicker(message.progressNewState);
					break;
				default:
					console.log("some message in content");
			}
		});
	}
	getProgress() {
		this.trackDuration = parseFloat(
			document
				.querySelector(".progress__bar.progress__text")
				.getAttribute("data-duration")
		);
		this.trackPlayedTime = parseFloat(
			document
				.querySelector(".progress__bar.progress__text")
				.getAttribute("data-played-time")
		);
		this.progress = parseFloat(
			(-100 + (this.trackPlayedTime / this.trackDuration) * 100).toFixed(4)
		);
	}

	getPlayBtn() {
		if (document.querySelector(".player-controls__btn_pause") != null)
			this.playBtnSrc = "icons/pause.svg";
		else this.playBtnSrc = "icons/play.svg";
	}
	sendMessageToPopup(parameters) {
		// проверка открыт ли попап
		// Получаем список открытых окон (вкладок и попапов) вашего расширения

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
let trackManager;
if (
	document.querySelectorAll(".track__title").length > 0 &&
	document.querySelectorAll(".track__artists").length > 0 &&
	document.querySelectorAll(
		".player-controls__track .entity-cover__image.deco-pane"
	).length > 0
) {
	trackManager = new MyTrackManager();
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
			trackManager = new MyTrackManager();
			trackManager.attachListeners();
		}
	}
}

let barObserver = new MutationObserver((mutationList) => {
	for (let mutation of mutationList) {
		if (mutation.type === "attributes") {
			// Проверяем, что элемент имеет класс "progress"
			if (mutation.target.classList.contains("progress__line__branding")) {
				let localProgress = parseFloat(
					document
						.querySelector(".progress__line__branding")
						.style.transform.slice(11, -2)
				);
				let progressRight =
					document.querySelector(".progress__right").innerText;
				let progressLeft = document.querySelector(".progress__left").innerText;

				chrome.runtime.sendMessage({
					message: "progress",
					progress: localProgress,
					progressRight: progressRight,
					progressLeft: progressLeft,
				});
			} else if (
				mutation.target.classList.contains("player-controls__btn_play")
			) {
				let localPlayBtn;
				if (document.querySelector(".player-controls__btn_pause") != null)
					localPlayBtn = "icons/pause.svg";
				else localPlayBtn = "icons/play.svg";

				chrome.runtime.sendMessage({
					message: "playBtn",
					playBtnSrc: localPlayBtn,
				});
			}
		} else if (mutation.type === "childList") {
			if (
				mutation.target.classList.contains(
					"player-controls__track-container"
				) &&
				mutation.addedNodes.length > 0
			) {
				let localPlayBtn;
				if (document.querySelector(".player-controls__btn_pause") != null)
					localPlayBtn = "icons/pause.svg";
				else localPlayBtn = "icons/play.svg";
				let localTrackName =
					document.querySelector(".track__title").textContent;
				let localTrackArtists =
					document.querySelector(".track__artists").textContent;
				let localImgSrc = document.querySelector(
					".player-controls__track .entity-cover__image.deco-pane"
				).src;
				chrome.runtime.sendMessage({
					message: "trackChange",
					playBtnSrc: localPlayBtn,
					trackName: localTrackName,
					trackArtists: localTrackArtists,
					imgSrc: localImgSrc,
				});
			}
		}
	}
});
barObserver.observe(document.querySelector(".bar__content"), {
	childList: true,
	subtree: true,
	attributes: true,
});

document.addEventListener("click", (e) => {
	console.log(e.target, e.clientX, e.clientY);
});
