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
		this.trackImg = document.querySelector(".track__img");
		this.progressBar = document.querySelector(".progress__bar__line");
	}
	fullPageSetter(message) {
		this.trackName.textContent = message.trackName;
		this.trackArtists.textContent = message.trackArtists;
		this.playBtn.style.backgroundImage = "url(" + message.playBtnSrc + ")";
		this.trackImg.src = message.imgSrc.slice(0, -5) + "300x300";
		this.progressBar.style.width = String(100 + message.progress) + "%";
	}

	attachListeners() {
		chrome.runtime.onMessage.addListener((message, sender) => {
			switch (message.message) {
				case "fullPage":
					console.log(message.message);
					this.fullPageSetter(message);
					break;

				case "tabReady":
					this.tabReady = true;

					break;
				case "fromBg":
					console.log(message);
					break;
				case "progress":
					this.progressBar.style.width = String(100 + message.progress) + "%";

					break;
			}
		});
	}
}
const popup = new Popup();
popup.attachListeners();
