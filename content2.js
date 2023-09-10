"use strict";

const styleElement = document.createElement("style");
styleElement.textContent = `
* {
	box-sizing: border-box;
}

@font-face {
	font-family: "Istok Web Regular";
	src: url(popup/fonts/IstokWeb-Regular.ttf);
}
.my__spinner {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: 6.4px solid #ffcc00;
	animation: spinner-bulqg1 0.8s infinite linear alternate,
		 spinner-oaa3wk 1.6s infinite linear;
 }
 
 @keyframes spinner-bulqg1 {
	0% {
	   clip-path: polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%);
	}
 
	12.5% {
	   clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%);
	}
 
	25% {
	   clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%);
	}
 
	50% {
	   clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
	}
 
	62.5% {
	   clip-path: polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
	}
 
	75% {
	   clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%);
	}
 
	100% {
	   clip-path: polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%);
	}
 }
 
 @keyframes spinner-oaa3wk {
	0% {
	   transform: scaleY(1) rotate(0deg);
	}
 
	49.99% {
	   transform: scaleY(1) rotate(135deg);
	}
 
	50% {
	   transform: scaleY(-1) rotate(0deg);
	}
 
	100% {
	   transform: scaleY(-1) rotate(-135deg);
	}
 }
 .analyze__wrapper {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	width: 500px;
	height: 400px;
}
.yandex__music {
	font-size: 20px;
	font-weight: 900;
}
.statistics {
	font-size: 22px;
}

.range {
	width: 300px;
	height: 5px;
	background-color: #ccc;
	position: relative;
	border-radius: 5px;
	border:none;
}

.slider {
	width: 0px;
	height: 100%;
	background-color: #ffcc00;
	border-radius: 5px;
	border:none;
}

.thumb {
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 13px;
	height: 13px;
	border-radius: 50%;
	background-size: 100%;
	background-position: center;
	position: absolute; /* Позиционирование внутреннего элемента */
	top: -4.5px; /* Расположение сверху вниз */
	left: 0px;
}
.thumb__inner {
	width: 9px;
	height: 9px;
	background-color: #ffcc00;
	border-radius: 50%;
}

.analyze__btn {
	width: 200px;
	height: 55px;
	font-size: 17px;
	background-color: #ffcc00;
	color: white;
	border-radius: 40px;
	border: none;
}
.analyze__btn:hover {
	cursor: pointer;
	opacity: 0.85;
}
.tracks{
	min-width: 50px;
	text-align: center;
	user-select: none;
}
.track__col{
	min-width:50px;
	text-align: center;
	user-select: none;
}

.sets__wrapper {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 0 20px;
	font-size: 17px;
}
    `;

document.body.appendChild(styleElement);

let div = document.createElement("div");

div.style.width = "100%";
div.style.height = "100%";
div.style.position = "fixed";
div.style.bottom = "0px";
div.style.right = "0px";
div.style.backgroundColor = "white";
div.style.display = "flex";
div.style.flexDirection = "column";
div.style.justifyContent = "center";
div.style.alignItems = "center";
div.style.zIndex = "101";

div.innerHTML = `<div class="my__spinner" id="mySpinner"></div>`;

document.body.appendChild(div);

console.log("created");

document.body.style.pointerEvents = "auto";

let queueBtn = document.querySelector(".d-icon.d-icon_playlist-next");

/* Обсервер, проверяющий открыт попап или нет */
let bodyObserver = new MutationObserver(() => {
	if (
		document.querySelector(".popup-holder") != null &&
		document.querySelector(".d-icon.d-icon_playlist-next") != null &&
		document.querySelector(".d-link.deco-link.track__title")
	) {
		bodyObserver.disconnect();

		//starting Popup Observer
		popupObserver.observe(document.querySelector(".popup-holder"), {
			childList: true,
			subtree: true,
		});

		//refreshing and clicking the btn
		queueBtn = document.querySelector(".d-icon.d-icon_playlist-next");
		queueBtn.click();
	}
});
/*Обсервер проверяющий вкладку очереди или истории */
let popupObserver = new MutationObserver(() => {
	if (document.querySelector(".popup-sequence__history-tab") != null) {
		if (
			document.querySelector(".current.popup-sequence__history-tab") == null
		) {
			document.querySelector(".popup-sequence__history-tab").click();
		}
		if (
			document.querySelector(".current.popup-sequence__history-tab") != null &&
			document.querySelector(".popup-sequence__tracks") != null &&
			document.querySelectorAll(".d-track.typo-track.d-track_with-cover")
				.length > 25
		) {
			popupObserver.disconnect();
			console.log(
				document.querySelector(".spinner"),
				document.querySelector("#mySpinner")
			);
			document.querySelector("#mySpinner").style.display = "none";
			// div.style.backgroundColor = "grey";
			div.innerHTML = `<div class="analyze__wrapper">
								<div class="nav__title">
									<span class="yandex__music">ЯндексМузыка</span>
									<span class="statistics">Statistics</span>
								</div>
								<div class="sets__wrapper">
									<div class="tracks">Tracks</div>
									<!-- <div class="tracks__range">
										<div class="range__selector">
											<div class="circle"></div>
										</div>
									</div> -->
									<div class="range">
										<div class="slider"></div>
										<div class="thumb">
											<div class="thumb__inner"></div>
										</div>
									</div>
									<div class="track__col">250</div>
								</div>
								<button class="analyze__btn">Start</button>
							</div>`;
			const range = document.querySelector(".range");
			const slider = range.querySelector(".slider");
			const thumb = range.querySelector(".thumb");
			const tracksDiv = document.querySelector(".track__col");
			let tracks = 0;

			const maxTracks =
				document.querySelector(".popup-sequence__tracks").clientHeight /
				document.querySelector(".d-track.typo-track").clientHeight;

			document.querySelector(".analyze__btn").addEventListener("click", () => {
				if (tracks > 0) {
					div.innerHTML = `<div class="my__spinner" id="mySpinner"></div>`;
					scrollToEnd(tracks);
				}
			});
			tracks = 0;
			tracksDiv.textContent = tracks;

			thumb.addEventListener("mousedown", (event) => {
				event.preventDefault();
				const startX = event.clientX - thumb.getBoundingClientRect().left;

				function moveThumb(event) {
					const newX =
						event.clientX - range.getBoundingClientRect().left - startX;
					const min = 0;
					const max = range.clientWidth - thumb.clientWidth / 2;

					if (newX >= min && newX <= max) {
						tracks = parseInt((maxTracks / 100) * (newX / max) * 100);
						tracksDiv.textContent = tracks;

						thumb.style.left = newX + "px";
						slider.style.width = newX + "px";
					}
					if (newX < min) {
						tracks = parseInt((maxTracks / 100) * (0 / max) * 100);
						tracksDiv.textContent = tracks;
						thumb.style.left = 0 + "px";
						slider.style.width = 0 + "px";
					}
					if (newX > max) {
						tracks = parseInt(maxTracks);
						tracksDiv.textContent = tracks;
						thumb.style.left = max + "px";
						slider.style.width = max + thumb.clientWidth / 2 + "px";
					}
				}

				function stopMove() {
					document.removeEventListener("mousemove", moveThumb);
					document.removeEventListener("mouseup", stopMove);
				}

				document.addEventListener("mousemove", moveThumb);
				document.addEventListener("mouseup", stopMove);
			});
		}
	}
});

let dictionary1 = [];
let dictionary2 = [];

async function collectTracks(lastId, lastFirstId) {
	let trackArr = document.querySelector(".lightlist__cont").childNodes;
	let localMaxId = 0;
	let localCollected = 0;
	for (let track of trackArr) {
		if (
			(track.getAttribute("data-id") &&
				track.querySelector(".typo-track.deco-typo-secondary").innerText &&
				track.querySelector(".d-track__artists").innerText &&
				track.querySelector(".entity-cover__image").src &&
				track.getAttribute("data-id") != lastFirstId &&
				track.getAttribute("data-id") != lastId) ||
			track.querySelector(".entity-cover__image_no-cover")
		) {
		} else {
			await new Promise((resolve) => setTimeout(resolve, 50));
			return collectTracks(lastId, lastFirstId);
		}
	}

	console.log("первый for пройден");

	//добавляем в словарик
	for (let track of trackArr) {
		localCollected += 1;
		localMaxId = parseInt(track.getAttribute("data-id"));
		let trackName = track.querySelector(".d-track__name").textContent;
		if (trackName.includes("<")) {
			trackName = trackName.replace(/</g, "&lt;");
		}

		const timeString = track.querySelector(
			".typo-track.deco-typo-secondary"
		).innerText;

		let secondsDuration;
		const timeParts = timeString.split(":");
		if (timeParts.length == 2) {
			const min = parseInt(timeParts[0]);
			const sec = parseInt(timeParts[1]);
			secondsDuration = min * 60 + sec;
		} else if (timeParts.length == 3) {
			const hours = parseInt(timeParts[0]);
			const min = parseInt(timeParts[1]);
			const sec = parseInt(timeParts[2]);
			secondsDuration = hours * 60 * 60 + min * 60 + sec;
		}

		let isFound = false;
		for (let index = 0; index < dictionary1.length; index++) {
			if (dictionary1[index].name == trackName) {
				console.log(track.getAttribute("data-id"));
				isFound = true;
				dictionary1[index].times += 1;
				break;
			}
		}
		if (!isFound) {
			console.log(track.getAttribute("data-id"));
			dictionary1.push({
				name: trackName,
				imgSrc:
					track.querySelector(".entity-cover__image").src.slice(0, -5) +
					"40x40",
				times: 1,
				durationSec: secondsDuration,
			});
		}
	}
	console.log("второй for пройден->returning");

	return [
		localCollected,
		localMaxId,
		parseInt(trackArr[0].getAttribute("data-id")),
	];
}

async function collectLastTracks(lastCollectedTrack) {
	let trackArr = document.querySelector(".lightlist__cont").childNodes;
	for (let track of trackArr) {
		if (
			(track.getAttribute("data-id") &&
				track.querySelector(".typo-track.deco-typo-secondary").innerText &&
				track.querySelector(".d-track__artists").innerText &&
				track.querySelector(".entity-cover__image").src) ||
			track.querySelector(".entity-cover__image_no-cover")
		) {
		} else {
			await new Promise((resolve) => setTimeout(resolve, 50));
			return collectLastTracks(lastCollectedTrack);
		}
	}

	console.log("первый for пройден");

	//добавляем в словарик
	for (let track of trackArr) {
		let localLastId = 0;
		let trackId = track.getAttribute("data-id");
		if (trackId > lastCollectedTrack) {
			let secondsDuration;
			const timeParts = timeString.split(":");
			if (timeParts.length == 2) {
				const min = parseInt(timeParts[0]);
				const sec = parseInt(timeParts[1]);
				secondsDuration = min * 60 + sec;
			} else if (timeParts.length == 3) {
				const hours = parseInt(timeParts[0]);
				const min = parseInt(timeParts[1]);
				const sec = parseInt(timeParts[2]);
				secondsDuration = hours * 60 * 60 + min * 60 + sec;
			}
			localLastId = trackId;
			let trackName = track.querySelector(".d-track__name").textContent;
			if (trackName.includes("<")) {
				trackName = trackName.replace(/</g, "&lt;");
			}

			let isFound = false;
			for (let index = 0; index < dictionary1.length; index++) {
				if (dictionary1[index].name == trackName) {
					console.log(track.getAttribute("data-id"));
					isFound = true;
					dictionary1[index].times += 1;
					break;
				}
			}
			if (!isFound) {
				console.log(track.getAttribute("data-id"));
				dictionary1.push({
					name: trackName,
					imgSrc:
						track.querySelector(".entity-cover__image").src.slice(0, -5) +
						"40x40",
					times: 1,
					durationSec: secondsDuration,
				});
			}
		}
		console.log("второй for пройден->returning");

		return localLastId;
	}
}
/* Функция добавляющая все собранные треки в сторадж */
async function scrollToEnd(tracks) {
	let scrollingObject = document.querySelector(".popup-sequence__content");
	const trackHeight = document.querySelector(
		".d-track.typo-track.d-track_with-cover"
	).clientHeight;
	const scrollStep = trackHeight * 126;
	const endHeight = document.querySelector(
		".popup-sequence__tracks"
	).clientHeight;
	const maxTracks = endHeight / trackHeight;
	const scrollTimes = Math.ceil((tracks - 26) / 126);
	let lastId = 0;
	let lastFirstId = 0;
	let needToScroll = true;

	for (let scrollIndex = 1; scrollIndex <= scrollTimes; scrollIndex++) {
		if (scrollIndex != scrollTimes) {
			let receivedValues = await collectTracks(lastId, lastFirstId);
			lastId = receivedValues[1];
			lastFirstId = receivedValues[2];
			scrollingObject.scrollBy(0, scrollStep);
		} else {
			let receivedValues = await collectLastTracks(lastId);
			console.log(tracks, receivedValues);
		}
	}

	dictionary1.sort((a, b) => (a.times > b.times ? -1 : 1));

	var D = new Date();
	let titleDate =
		("0" + D.getDate()).slice(-2) +
		"." +
		("0" + (D.getMonth() + 1)).slice(-2) +
		"." +
		("0" + D.getFullYear()).slice(3);
	let dataId = Date.now();

	chrome.storage.local.get("trackStats").then((result) => {
		console.log("working with storage");
		if (result.trackStats == undefined) {
			chrome.storage.local.set({ trackStats: [dataId] });
		} else {
			let stats = result.trackStats;
			stats.push(dataId);
			chrome.storage.local.set({ trackStats: stats });
		}
	});
	let dataToSave = {};
	dataToSave[dataId] = {
		title: titleDate + " (" + tracks + " tracks)",
		tracks: dictionary1,
	};
	console.log("closing tab");
	chrome.storage.local.set(dataToSave).then(() => {
		chrome.runtime.sendMessage({ message: "closeStatTab" });
	});
}

/*
НАЧАЛО РАБОТЫ СКРИПТА
*/

bodyObserver.observe(document.body, {
	childList: true,
	subtree: true,
});
