// window.addEventListener("load", () => {
// 	// let trackName = document.querySelector(".track__title");
// 	// let trackArtists = document.querySelector(".track__artists");
// 	// let imgSrc = document.querySelector(".entity-cover__image");
// 	// let progressInPercents = document.querySelector(".progress__line__branding");
// 	// let progressLeft = document.querySelector(".progress__left");
// 	// let progressRight = document.querySelector(".progress__right");

// 	// let trackContainer = document.querySelector(".player-controls__track");

// 	console.log("injected");

// 	// const observer = new MutationObserver((mutationList) => {
// 	// 	for (let mutation of mutationList) {
// 	// 		console.log(mutation);
// 	// 	}
// 	// });
// 	// observer.observe(trackArtists, {
// 	// 	childList: true,
// 	// 	// subtree: true,
// 	// 	attributes: true,
// 	// 	characterData: true,
// 	// });
// 	// console.log(trackName, trackArtists, imgSrc, trackContainer);
// 	var div = document.createElement("div");

// 	// Устанавливаем стили для div
// 	div.style.width = "800px";
// 	div.style.height = "50px";
// 	div.style.position = "fixed";
// 	div.style.bottom = "10px";
// 	div.style.right = "10px";
// 	div.style.backgroundColor = "gray";
// 	div.style.color = "white";
// 	div.style.textAlign = "right";
// 	div.style.padding = "5px";

// 	// Добавляем div на страницу
// 	document.body.appendChild(div);

// 	let progressInPercents = document.querySelector(".progress__line__branding");
// 	console.log(progressInPercents);

// 	let translate;

// 	const observer = new MutationObserver((mutationList) => {
// 		mutationList.forEach((mutation) => {
// 			translate = parseFloat(progressInPercents.style.transform.slice(11, -2));
// 			chrome.runtime.sendMessage({
// 				message: translate,
// 			});
// 		});
// 	});

// 	observer.observe(progressInPercents, {
// 		attributes: true,
// 	});
// 	chrome.runtime.onMessage.addListener((message, sender) => {
// 		if (message.message == "RFFP") {
// 			div.textContent = "Request received";
// 			chrome.runtime.sendMessage({
// 				message: "Full cart",
// 				trackName: document.querySelector(".track__title").textContent,
// 				trackArtists: document.querySelector(".track__artists").textContent,
// 				imgSrc: document.querySelector(".entity-cover__image").src,
// 			});
// 		}
// 	});
// });

/*
window.addEventListener("load", () => {
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
});

function checkForElements() {
	const trackNameElements = document.querySelectorAll(".track__title");
	const trackArtistsElements = document.querySelectorAll(".track__artists");
	const imgElements = document.querySelectorAll(
		".player-controls__track .entity-cover__image.deco-pane"
	);

	if (
		trackNameElements.length > 0 &&
		trackArtistsElements.length > 0 &&
		imgElements.length > 0
	) {
		console.log(
			"Элементы загрузились:",
			trackNameElements[0],
			trackArtistsElements[0],
			imgElements[0]
		);

		observer.disconnect();
	}
}

const observer = new MutationObserver(checkForElements);

observer.observe(document.body, { childList: true, subtree: true });

// Также, вызываем функцию checkForElements в начале, чтобы проверить сразу, если элементы уже загружены.
checkForElements();*/

/*
	СЛОВАРИК message:
	getFullPage = все элементы(popup открыт){trackName, imgSrc, trackArtists, progressTranslate}
*/

// ПРобуем ООП

class TrackManager {
	constructor() {
		let trackName = null;
		let trackArtists = null;
		let imgSrc = null;
		let progressBar = null;
		let playBtnSrc = null;
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
		console.log(this.playBtnSrc, this.trackArtists);
	}
	attachListeners() {
		chrome.runtime.onMessage.addListener((message, sender) => {
			"message have been received";
			switch (message.message) {
				case "getFullPage":
					this.setFullPage();
					this.sendMessageToPopup({
						message: "fullPage",
						trackArtists: this.trackArtists,
						trackName: this.trackName,
						imgSrc: this.imgSrc,
						playBtnSrc: this.playBtnSrc,
					});
					break;
			}
		});
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
		console.log("manager created");
		const trackManager = new TrackManager();
		trackManager.attachListeners();
	}
}

// let trackManager = new MessageManager();
