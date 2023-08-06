"use strict";
class TrackManager {
	constructor() {
		this.trackName = null;
		this.trackArtists = null;
		this.imgSrc = null;
		this.playBtnSrc = null;
		this.progress = null; //progress in percents
		this.setFullPage();
		this.sendMessageToPopup({
			message: "fullPage",
			trackArtists: this.trackArtists,
			trackName: this.trackName,
			imgSrc: this.imgSrc,
			playBtnSrc: this.playBtnSrc,
		});
		this.queueBtn = null;
	}

	//getting progress in percents
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
	createClickEvents(tapX) {
		let eventDown = new MouseEvent("mousedown", {
			clientX: tapX,
		});
		let eventMove = new MouseEvent("mousemove", {
			clientX: tapX,
		});
		let eventUp = new MouseEvent("mouseup", {
			bubbles: true,
			clientX: tapX,
		});
		return [eventDown, eventMove, eventUp];
	}
	progressClicker(newState) {
		let progressLine = document.querySelector(
			".player-progress.progress.deco-progress.progress_branding"
		);
		let click = this.createClickEvents(
			parseInt(
				(progressLine.clientWidth / 100) * newState +
					(document.body.clientWidth - progressLine.clientWidth) / 2
			)
		);
		progressLine.dispatchEvent(click[0]);
		progressLine.dispatchEvent(click[1]);
		//needs timeout for ym to load class, that's why event "click" didn't work
		progressLine.dispatchEvent(click[2]);
	}

	statisticsBtnClicker() {
		// getHistory();
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
				case "statisticsBtnClicked":
					this.statisticsBtnClicker();
					break;
				default:
					console.log("some message in content", message);
			}
		});
	}

	sendMessageToPopup(parameters) {
		// проверка открыт ли попап
		// Получаем список открытых окон (вкладок и попапов) вашего расширения

		chrome.runtime.sendMessage(parameters);
	}
}
//
//

class TrackObserver extends TrackManager {
	constructor() {
		super();
		this.localPlayBtn = null;
		this.localProgress = null;
		this.progressRight = null;
		this.progressLeft = null;

		//start observing
		this.barObserver = new MutationObserver(
			this.barMutationsHandler.bind(this)
		);

		this.barObserver.observe(document.querySelector(".bar__content"), {
			childList: true,
			subtree: true,
			attributes: true,
		});
	}

	barMutationsHandler(mutationList) {
		for (let mutation of mutationList) {
			if (mutation.type === "attributes") {
				this.attributesMutationHandler(mutation);
			} else if (mutation.type === "childList") {
				this.childListMutationHandler(mutation);
			}
		}
	}

	attributesMutationHandler(mutation) {
		if (mutation.target.classList.contains("progress__line__branding")) {
			this.localProgress = parseFloat(
				document
					.querySelector(".progress__line__branding")
					.style.transform.slice(11, -2)
			);
			this.progressRight =
				document.querySelector(".progress__right").textContent;
			this.progressLeft = document.querySelector(".progress__left").textContent;
			this.sendMessageToPopup({
				message: "progress",
				progress: this.localProgress,
				progressRight: this.progressRight,
				progressLeft: this.progressLeft,
			});
		} else if (
			mutation.target.classList.contains("player-controls__btn_play")
		) {
			if (document.querySelector(".player-controls__btn_pause") != null)
				this.localPlayBtn = "icons/pause.svg";
			else this.localPlayBtn = "icons/play.svg";
			this.sendMessageToPopup({
				message: "playBtn",
				playBtnSrc: this.localPlayBtn,
			});
		}
	}

	childListMutationHandler(mutation) {
		if (
			mutation.target.classList.contains("player-controls__track-container") &&
			mutation.addedNodes.length > 0
		) {
			const localPlayBtn = document.querySelector(".player-controls__btn_pause")
				? "icons/pause.svg"
				: "icons/play.svg";
			const localTrackName =
				document.querySelector(".track__title").textContent;
			const localTrackArtists =
				document.querySelector(".track__artists").textContent;
			const localImgSrc = document.querySelector(
				".player-controls__track .entity-cover__image.deco-pane"
			).src;

			this.sendMessageToPopup({
				message: "trackChange",
				playBtnSrc: localPlayBtn,
				trackName: localTrackName,
				trackArtists: localTrackArtists,
				imgSrc: localImgSrc,
			});
		}
	}
}
/*


HISTORY GETTER


*/
async function getHistory() {
	var div = document.createElement("div");

	div.style.width = "800px";
	div.style.height = "50px";
	div.style.position = "fixed";
	div.style.bottom = "10px";
	div.style.right = "10px";
	div.style.backgroundColor = "gray";
	div.style.color = "white";
	div.style.textAlign = "right";
	div.style.padding = "5px";

	// Добавляем div на страницу
	document.body.appendChild(div);

	console.log("observer let");

	let observer = new MutationObserver(() => {
		console.log("mutation");
		if (document.querySelector(".popup-sequence__history-tab") != null) {
			if (
				document.querySelector(".current.popup-sequence__history-tab") == null
			) {
				document.querySelector(".popup-sequence__history-tab").click();
			}
			if (
				document.querySelector(".current.popup-sequence__history-tab") !=
					null &&
				document.querySelectorAll(
					".d-track typo-track.d-track_with-cover.d-track_in-lib.d-track_playing"
				).length > 0
			) {
				console.log("1");
				observer.disconnect();
			}
		}
	});

	console.log("observer observe");
	observer.observe(document.querySelector(".popup-holder"), {
		childList: true,
		subtree: true,
	});
	console.log("observer is observing");

	let queueBtn = document.querySelector(".d-icon.d-icon_playlist-next");
	let popupHolder = document.querySelector(".popup-holder.sequence");

	console.log("clicking");
	queueBtn.click();
}

/*






STRARTING CLASS WORK







*/
let trackManager;
if (
	document.querySelectorAll(".track__title").length > 0 &&
	document.querySelectorAll(".track__artists").length > 0 &&
	document.querySelectorAll(
		".player-controls__track .entity-cover__image.deco-pane"
	).length > 0
) {
	trackManager = new TrackObserver();
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
			trackManager = new TrackObserver();
			trackManager.attachListeners();
		}
	}
}
