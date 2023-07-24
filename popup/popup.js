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
let trackName = document.querySelector(".track__title");
let trackArtists = document.querySelector(".track__artists");
let playBtn = document.querySelector(".play__track__btn");
let trackImg = document.querySelector(".track__img");

chrome.runtime.onMessage.addListener(function (message, sender) {
	if (message.message == "fromBg") {
		console.log(message.myTab);
	}

	if (message.message == "fullPage") {
		trackName.textContent = message.trackName;
		trackArtists.textContent = message.trackArtists;
		playBtn.style.backgroundImage = "url(" + message.playBtnSrc + ")";
		console.log(message.playBtnSrc);
		console.log(message.imgSrc);
	}
	//  else {
	// 	document.querySelector(".progress__bar__line").style.width =
	// 		String(100 + message.message) + "%";
	// }
});
chrome.runtime.sendMessage({ message: "getFullPage" });
