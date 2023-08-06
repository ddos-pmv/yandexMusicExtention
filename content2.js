"use strict";
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

// document.body.addChild(div);

document.body.style.pointerEvents = "none";

let queueBtn = document.querySelector(".d-icon.d-icon_playlist-next");
let bodyObserver = new MutationObserver(() => {
	if (
		document.querySelector(".popup-holder") != null &&
		document.querySelector(".d-icon.d-icon_playlist-next") != null
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
			scrollToEnd();
		}
	}
});

let dictionary = [];

async function scrollToEnd() {
	let scrollingObject = document.querySelector(".popup-sequence__content");
	const scrollStep =
		document.querySelector(".d-track.typo-track.d-track_with-cover")
			.clientHeight * 126;
	const endHeight = document.querySelector(
		".popup-sequence__tracks"
	).clientHeight;
	let lastId = 0;
	let lastHeight = 0;
	const scrollDelay = 500;
	while (lastHeight < endHeight - 64 * 125) {
		console.log(lastHeight, endHeight);
		lastId = await waitForElements(lastId);
		scrollingObject.scrollBy(0, scrollStep);
		lastHeight += scrollStep;
		console.log(lastId);
		await sleep(scrollDelay);
	}

	const sortedArray = Object.entries(dictionary).sort((a, b) => b[1] - a[1]);

	console.log(sortedArray);
	document.body.style.pointerEvents = "auto";
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function waitForElements(oldId) {
	return new Promise((resolve) => {
		const checkElements = () => {
			let tracksArr = document.querySelector(".lightlist__cont").childNodes;
			let newLastId;
			console.log(
				"promise",
				oldId + 1 == parseInt(tracksArr[0].getAttribute("data-id")),
				oldId,
				tracksArr[0].getAttribute("data-id"),
				tracksArr[tracksArr.length - 1].getAttribute("data-id")
			);
			if (oldId + 1 == parseInt(tracksArr[0].getAttribute("data-id"))) {
				console.log(oldId, tracksArr[0].getAttribute("data-id"));
				for (let track of tracksArr) {
					if (
						parseInt(track.getAttribute("data-id")) != NaN &&
						parseInt(track.getAttribute("data-id")) != null &&
						track.querySelector(".d-track__name")
					) {
						let trackName = track.querySelector(".d-track__name").textContent;
						if (trackName in dictionary) {
							dictionary[trackName] += 1;
						} else {
							dictionary[trackName] = 1;
						}
						newLastId = track.getAttribute("data-id");
					} else {
						setTimeout(checkElements, 200);
						break;
					}
				}
				resolve(parseInt(newLastId));
			} else {
				setTimeout(checkElements, 200);
			}
		};

		checkElements();
	});
}

bodyObserver.observe(document.body, {
	childList: true,
	subtree: true,
});
