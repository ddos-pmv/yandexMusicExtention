// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 	document.querySelector(".app").textContent = message.msg;
// 	console.log(sender);

// 	// Отправка ответного сообщения обратно в background.js
// 	sendResponse("Message received by popup.js");
// });
// a = 0;
// a += 1;
// console.log(a);
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// 	// Обработка полученного сообщения
// 	document.querySelector("#txt").textContent = request.message;
// 	console.log(request.message);
// });

// console.log(123);

// chrome.runtime.onMessage.addListener((message, sender) => {
// 	if (message.message == "fromBg") {
// 		console.log(message.myTab);
// 	}
// 	//  else {
// 	// 	document.querySelector(".progress__bar__line").style.width =
// 	// 		String(100 + message.message) + "%";
// 	// }
// });
// chrome.runtime.sendMessage({ message: "getFullPage" });

class Popup {
	constructor() {
		this.tabReady = false;
		chrome.runtime.sendMessage({ message: "getFullPage" });
		this.trackName = document.querySelector(".track__title");
		this.trackArtists = document.querySelector(".track__artists");
		this.playBtn = document.querySelector(".play__track__btn");
		this.prevBtn = document.querySelector(".prev__track__btn");
		this.nextBtn = document.querySelector(".next__track__btn");
		this.trackImg = document.querySelector(".track__img");
		this.progressBar = document.querySelector(".progress__bar__line");
		this.progressRight = document.querySelector(".progress__right");
		this.progressLeft = document.querySelector(".progress__left");
		this.progressBarWrapper = document.querySelector(".progress__bar__wrapper");
		this.statisticsBtn = document.querySelector(".statistics");
	}
	fullPageSetter(message) {
		this.trackName.textContent = message.trackName;
		this.trackArtists.textContent = message.trackArtists;
		this.playBtn.style.backgroundImage = "url(" + message.playBtnSrc + ")";
		this.trackImg.src = message.imgSrc.slice(0, -5) + "300x300";
		if (message.progress != null)
			this.progressBar.style.width = String(100 + message.progress) + "%";
		this.statisticsBtn.style.pointerEvents = "auto";
	}

	playBtnClickHandler() {
		chrome.runtime.sendMessage({ message: "playBtnClicked" });
	}
	nextBtnClickHandler() {
		chrome.runtime.sendMessage({ message: "nextBtnClicked" });
	}
	prevBtnClickHandler() {
		chrome.runtime.sendMessage({ message: "prevBtnClicked" });
	}
	trackChange(message) {
		this.trackName.textContent = message.trackName;
		this.trackArtists.textContent = message.trackArtists;
		this.playBtn.style.backgroundImage = "url(" + message.playBtnSrc + ")";
		this.trackImg.src = message.imgSrc.slice(0, -5) + "300x300";
	}
	progressClickHandler(e) {
		console.log("sended");
		chrome.runtime.sendMessage({
			message: "progressClicked",
			progressNewState: (e.offsetX / this.progressBarWrapper.clientWidth) * 100,
		});
	}
	statisticsBtnClickHandler(e) {
		"click in popup";
		chrome.tabs.create(
			{
				url: "https://music.yandex.ru/home",
				index: 0,
				active: true,
			},
			(tab) => {
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: ["/content2.js"],
				});
			}
		);
		chrome.runtime.sendMessage({ message: "statisticsBtnClicked" });
	}
	attachListeners() {
		this.playBtn.addEventListener("click", this.playBtnClickHandler);
		this.nextBtn.addEventListener("click", this.nextBtnClickHandler);
		this.prevBtn.addEventListener("click", this.prevBtnClickHandler);

		this.statisticsBtn.addEventListener(
			"click",
			this.statisticsBtnClickHandler
		);

		this.progressBarWrapper.addEventListener(
			"click",
			this.progressClickHandler.bind(this)
		);

		chrome.runtime.onMessage.addListener((message, sender) => {
			switch (message.message) {
				case "fullPage":
					this.fullPageSetter(message);
					break;

				case "tabReady":
					this.tabReady = true;

					break;
				case "fromBg":
					console.log(message);
					break;
				case "progress":
					if (message.progress != null) {
						this.progressBar.style.width = String(100 + message.progress) + "%";
					}
					this.progressLeft.textContent = message.progressLeft;
					this.progressRight.textContent = message.progressRight;

					break;
				case "playBtn":
					this.playBtn.style.backgroundImage =
						"url(" + message.playBtnSrc + ")";
					break;
				case "trackChange":
					this.trackChange(message);
			}
		});
	}
}
const popup = new Popup();
popup.attachListeners();
