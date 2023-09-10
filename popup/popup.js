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
		this.app3Cross = document.querySelector(".app3__cross");
		this.app3 = document.querySelector(".app3");
		this.app3InjectedContent = document.querySelector(
			".app3__injected__content"
		);
		this.app2 = document.querySelector(".app2");
		chrome.storage.local.get("extended", (result) => {
			if (result.extended) {
				this.app2.style.transition = null;
				this.app2.style.transform = "translateY(440px)";
			} else {
				this.app2.style.transition = " all 0.1s linear";
			}
		});
		this.progressDragging = false;
		this.progressCircle = document.querySelector(".progress__circle");
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
		this.expand = document.querySelector(".expand");
		this.likeBtn = document.querySelector(".like__track__btn");
		this.shuffleBtn = document.querySelector(".shuffle__track__btn");
		this.repeatBtn = document.querySelector(".repeat__track__btn");

		this.app1TrackName = document.querySelector(".app1__track__title");
		this.app1TrackArtists = document.querySelector(".app1__track__artists");
		this.app1PLayBtn = document.querySelector(".app1__play__btn");
		this.app1LikeBtn = document.querySelector(".app1__like__btn");
		this.app1ProgressBarWrapper = document.querySelector(
			".app1__progress__wrapper"
		);
		this.app1ProgressBar = document.querySelector(".app1__progress");

		this.app1TitleContainer = document.querySelector(".app1__title__container");
		// this.statisticsBtn = document.querySelector(".statistics");
	}
	fullPageSetter(message) {
		if (message.trackName.length > 35) {
			message.trackName = message.trackName.slice(0, 35) + "...";
		}
		if (message.trackArtists.length > 40) {
			message.trackArtists = message.trackArtists.slice(0, 40) + "...";
		}
		this.trackName.textContent = message.trackName;
		this.trackArtists.textContent = message.trackArtists;

		this.app1TrackName.textContent = message.trackName;
		this.app1TrackArtists.textContent = message.trackArtists;
		this.playBtnSetter(message.playBtnSrc);
		// this.playBtn.style.backgroundImage = "url(" + message.playBtnSrc + ")";
		this.trackImg.src = message.imgSrc.slice(0, -5) + "300x300";
		if (message.progress != null) {
			this.progressBar.style.width = String(100 + message.progress) + "%";
			this.app1ProgressBar.style.width = String(100 + message.progress) + "%";
		}
		// this.statisticsBtn.style.pointerEvents = "auto";
		this.likeBtnSetter(message.likeBtn);
		this.setShuffleBtn(message.shuffleBtn);
		this.setRepeatBtn(message.repeatBtn);
		this.progressLeft.textContent = message.progressLeft;
		this.progressRight.textContent = message.progressRight;
	}
	playBtnSetter(playBtnSrc) {
		if (playBtnSrc == "icons/play.svg") {
			this.trackImg.style.padding = "20px";
			this.trackImg.style.borderRadius = "25px";
			this.playBtn.style.backgroundImage =
				"url(icons/play_circle_black_24dp.svg)";
			this.app1PLayBtn.style.backgroundImage = "url(icons/play.svg)";
		} else {
			this.trackImg.style.padding = "0";
			this.trackImg.style.borderRadius = "5px";
			this.playBtn.style.backgroundImage =
				"url(icons/pause_circle_black_24dp.svg)";
			this.app1PLayBtn.style.backgroundImage = "url(icons/pause.svg)";
		}
	}
	likeBtnSetter(state) {
		if (state == "full") {
			this.likeBtn.style.backgroundImage = "url(icons/heart-full.svg)";
			this.likeBtn.style.opacity = 1;

			this.app1LikeBtn.style.backgroundImage = "url(icons/heart-full.svg)";
			this.app1LikeBtn.style.opacity = 1;
		} else {
			this.likeBtn.style.backgroundImage = "url(icons/heart-player.svg)";
			this.likeBtn.style.opacity = 0.4;

			this.app1LikeBtn.style.backgroundImage = "url(icons/heart-player.svg)";
			this.app1LikeBtn.style.opacity = 0.4;
		}
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

		this.app1TrackName.textContent = message.trackName;
		this.app1TrackArtists.textContent = message.trackArtists;
		// this.playBtn.style.backgroundImage = "url(" + message.playBtnSrc + ")";
		this.playBtnSetter(message.playBtnSrc);
		this.trackImg.src = message.imgSrc.slice(0, -5) + "300x300";
	}
	progressClickHandler(e) {
		chrome.runtime.sendMessage({
			message: "progressClicked",
			progressNewState: (e.offsetX / this.progressBarWrapper.clientWidth) * 100,
		});
	}
	likeBtnClickHandler() {
		chrome.runtime.sendMessage({
			message: "likeBtnClicked",
		});
	}
	expandClickHandler() {
		this.app2.style.transform = "translateY(440px)";
		chrome.storage.local.set({ extended: true });
	}

	shuffleBtnClickHandler() {
		chrome.runtime.sendMessage({
			message: "shuffleBtnClicked",
		});
	}
	repeatBtnClickHandler() {
		chrome.runtime.sendMessage({
			message: "repeatBtnClicked",
		});
	}

	setRepeatBtn(state) {
		console.log(state, "repeatSetting");
		if (state == "repeat") {
			this.repeatBtn.style.backgroundImage = 'url("icons/repeat.svg")';
			this.repeatBtn.style.opacity = 0.4;
		} else if (state == "repeatGold") {
			this.repeatBtn.style.backgroundImage = 'url("icons/repeat-gold.svg")';
			this.repeatBtn.style.opacity = 1;
		} else {
			this.repeatBtn.style.backgroundImage = 'url("icons/repeat-one-gold.svg")';
			this.repeatBtn.style.opacity = 1;
		}
	}
	setShuffleBtn(state) {
		if (state == "shuffleGold") {
			this.shuffleBtn.style.backgroundImage = "url(icons/shuffle-gold.svg)";
			this.shuffleBtn.style.opacity = 1;
		} else {
			this.shuffleBtn.style.backgroundImage = "url(icons/shuffle.svg)";
			this.shuffleBtn.style.opacity = 0.4;
		}
	}
	analyzeBtnClickHandler(e) {
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
	}
	createTrackDiv(number, DataSrc, DataName, DataContent) {
		const trackDiv = document.createElement("div");
		trackDiv.className = "app3__track";

		// Создаем div с классом "app3__rate" и добавляем внутренний текст
		const rateDiv = document.createElement("div");
		rateDiv.className = "app3__rate";
		rateDiv.textContent = number;

		// Создаем img с классом "app3__track__img" и устанавливаем атрибут src
		const img = document.createElement("img");
		img.className = "app3__track__img";
		img.dataset.src = DataSrc;

		// Создаем div с классом "app3__track__title"
		const titleDiv = document.createElement("div");
		titleDiv.className = "app3__track__title";

		// Создаем div с классом "app3__track__name" и добавляем внутренний текст
		const nameDiv = document.createElement("div");
		nameDiv.className = "app3__track__name";
		nameDiv.dataset.name = DataName;

		// Создаем div с классом "app3__track__stats" и добавляем внутренний текст
		const statsDiv = document.createElement("div");
		statsDiv.className = "app3__track__stats";
		statsDiv.dataset.content = DataContent;

		// Добавляем div "app3__rate" внутрь "app3__track"
		trackDiv.appendChild(rateDiv);

		// Добавляем img "app3__track__img" внутрь "app3__track"
		trackDiv.appendChild(img);

		// Добавляем div "app3__track__name" и "app3__track__stats" внутрь "app3__track__title"
		titleDiv.appendChild(nameDiv);
		titleDiv.appendChild(statsDiv);

		// Добавляем div "app3__track__title" внутрь "app3__track"
		trackDiv.appendChild(titleDiv);
		return trackDiv;
	}

	openStat(statId) {
		let trackCartObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						console.log(
							entry.target.querySelector(".app3__track__img").dataset.src,
							entry.target
						);
						entry.target.querySelector(".app3__track__img").src =
							entry.target.querySelector(".app3__track__img").dataset.src;
						entry.target.querySelector(".app3__track__name").textContent =
							entry.target.querySelector(".app3__track__name").dataset.name;
						entry.target.querySelector(".app3__track__stats").textContent =
							entry.target.querySelector(".app3__track__stats").dataset.content;
						observer.unobserve(entry.target);
					}
				});
			},
			{
				rootMargin: "1200px 0px 0px",
			}
		);
		this.app3.style.display = "block";
		console.log(statId);
		chrome.storage.local.get(statId).then((result) => {
			for (let index = 0; index < result[statId].tracks.length; index++) {
				let trackContent =
					result[statId].tracks[index].times +
					" times, " +
					Math.round(
						(result[statId].tracks[index].times *
							result[statId].tracks[index].durationSec) /
							60
					) +
					" minutes";
				const trackCart = this.createTrackDiv(
					index + 1,
					result[statId].tracks[index].imgSrc,
					result[statId].tracks[index].name,
					trackContent
				);
				this.app3InjectedContent.appendChild(trackCart);
				trackCartObserver.observe(trackCart);
			}
		});
	}
	deleteStat(statId) {
		let stats = document.querySelectorAll(".stat");

		for (let stat of stats) {
			if (stat.getAttribute("data-id") == statId) {
				console.log("removing");
				stat.remove();
			}
		}
		chrome.storage.local.remove(statId);
		chrome.storage.local.get("trackStats").then((result) => {
			let trackStatsArr = result.trackStats;
			const indexToRemove = trackStatsArr.indexOf(statId);
			trackStatsArr.splice(indexToRemove, 1);
			chrome.storage.local.set({ trackStats: trackStatsArr });
			if (trackStatsArr.length == 0) {
			}
		});
	}
	attachListeners() {
		/*
		DREGGING
		*/
		this.progressBarWrapper.addEventListener("mousedown", (e) => {
			this.progressDragging = true;
		});
		document.addEventListener("mousemove", (e) => {
			if (!this.progressDragging) return;

			const newX = e.clientX - 32.5;
			this.progressBar.style.width = newX + "px";
		});
		document.addEventListener("mouseup", (e) => {
			if (this.progressDragging) {
				this.progressDragging = false;
				if (e.clientX < 32.5) {
					chrome.runtime.sendMessage({
						message: "progressClicked",
						progressNewState: 0,
					});
				} else {
					chrome.runtime.sendMessage({
						message: "progressClicked",
						progressNewState:
							(e.offsetX / this.progressBarWrapper.clientWidth) * 100,
					});
				}
			}
		});

		/*
		SETTING OPACITY
		*/
		//Like btn opacity
		this.likeBtn.addEventListener("mouseenter", (e) => {
			this.likeBtn.style.opacity = "0.85";
		});
		this.likeBtn.addEventListener("mouseleave", (e) => {
			if (
				this.likeBtn.style.backgroundImage == 'url("icons/heart-player.svg")'
			) {
				this.likeBtn.style.opacity = "0.4";
			} else {
				this.likeBtn.style.opacity = "1";
			}
		});

		//shuffle btn opacity
		this.shuffleBtn.addEventListener("mouseenter", (e) => {
			this.shuffleBtn.style.opacity = "0.85";
		});
		this.shuffleBtn.addEventListener("mouseleave", (e) => {
			if (this.shuffleBtn.style.backgroundImage == 'url("icons/shuffle.svg")') {
				this.shuffleBtn.style.opacity = "0.4";
			} else {
				this.shuffleBtn.style.opacity = "1";
			}
		});

		//repeat btn opacity
		this.repeatBtn.addEventListener("mouseenter", (e) => {
			this.repeatBtn.style.opacity = "0.85";
		});
		this.repeatBtn.addEventListener("mouseleave", (e) => {
			if (this.repeatBtn.style.backgroundImage == 'url("icons/repeat.svg")') {
				this.repeatBtn.style.opacity = "0.4";
			} else {
				this.repeatBtn.style.opacity = "1";
			}
		});

		document.addEventListener("click", (e) => {
			switch (e.target) {
				case this.playBtn:
					this.playBtnClickHandler();
					break;
				case this.nextBtn:
					this.nextBtnClickHandler();
					break;
				case this.prevBtn:
					this.prevBtnClickHandler();
					break;
				case this.expand:
					this.expandClickHandler();
					break;
				case this.likeBtn:
					this.likeBtnClickHandler();
					break;
				case this.shuffleBtn:
					this.shuffleBtnClickHandler();
					break;
				case this.repeatBtn:
					this.repeatBtnClickHandler();
					break;
				case this.app1LikeBtn:
					this.likeBtnClickHandler();
					break;
				case this.app1PLayBtn:
					this.playBtnClickHandler();
					break;
				case this.app1TrackArtists:
					this.app2.style.transition = " all 0.1s linear";
					document.querySelector(".app2").style.transform = "translateY(0)";
					chrome.storage.local.set({ extended: false });
					break;
				case this.app1TrackName:
					this.app2.style.transition = " all 0.1s linear";
					document.querySelector(".app2").style.transform = "translateY(0)";
					chrome.storage.local.set({ extended: false });
					break;
				case this.app1TitleContainer:
					this.app2.style.transition = " all 0.1s linear";
					document.querySelector(".app2").style.transform = "translateY(0)";
					chrome.storage.local.set({ extended: false });
					break;
				case this.app3Cross:
					this.app3InjectedContent.innerHTML = "";
					this.app3.style.display = "none";
				// case document.querySelector(".app1__controls"):
				// 	if (e.target != this.app1LikeBtn && e.target != this.app1PLayBtn)
				// 		document.querySelector(".app2").style.transform = "translateY(0)";
				// 	break;
				default:
					break;
			}
			if (e.target.classList.contains("stat__title")) {
				this.openStat(e.target.getAttribute("data-id"));
			}
			if (e.target.classList.contains("stat__more")) {
				this.deleteStat(e.target.getAttribute("data-id"));
			}
		});

		// this.statisticsBtn.addEventListener(
		// 	"click",
		// 	this.statisticsBtnClickHandler
		// );

		// this.progressBarWrapper.addEventListener(
		// 	"click",
		// 	this.progressClickHandler.bind(this)
		// );

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
					if (!this.progressDragging) {
						if (message.progress != null) {
							this.progressBar.style.width =
								String(100 + message.progress) + "%";
						}
						this.progressLeft.textContent = message.progressLeft;
						this.progressRight.textContent = message.progressRight;
					}
					if (message.progress != null)
						this.app1ProgressBar.style.width =
							String(100 + message.progress) + "%";
					break;
				case "playBtn":
					// this.playBtn.style.backgroundImage =
					// 	"url(" + message.playBtnSrc + ")";
					this.playBtnSetter(message.playBtnSrc);
					break;
				case "likeBtn":
					this.likeBtnSetter(message.likeBtn);
					break;
				case "trackChange":
					console.log("chenged msg");
					this.trackChange(message);
					break;
				case "repeatBtn":
					this.setRepeatBtn(message.repeatBtn);
					break;

				case "shuffleBtn":
					this.setShuffleBtn(message.shuffleBtn);
			}
		});
	}
}
/*
trackStats = []
*/
class PopupInner extends Popup {
	constructor() {
		super();

		this.injectedContent = document.querySelector(".app1__injected__content");
		chrome.storage.local.get("trackStats").then((result) => {
			if (result.trackStats == undefined || result.trackStats.length < 1) {
				this.setInjectedContent(content.noStatsContent);
			} else {
				this.setInjectedContent(content.stats);
				for (let index = 0; index < result.trackStats.length; index++) {
					let newDiv = document.createElement("div");
					newDiv.classList.add("stat");
					newDiv.dataset.id = result.trackStats[index];
					this.injectedContent.appendChild(newDiv);
					chrome.storage.local
						.get(String(result.trackStats[index]))
						.then((stat) => {
							console.log(
								stat,
								result.trackStats[index],
								stat[result.trackStats[index]]
							);
							newDiv.innerHTML =
								`<div class="stat__upper">
									<div class="stat__title" data-id="${result.trackStats[index]}">Статистика на ${
									stat[result.trackStats[index]].title
								}</div>
									<div class="stat__more" data-id="${result.trackStats[index]}"></div>
								</div>
								<div class="stat__preview">
									<div class="stat__track"
										style="background-image: url(` +
								stat[result.trackStats[index]].tracks[0].imgSrc.slice(0, -5) +
								"150x150" +
								`);">
										<div class="stat__track__rate">#1</div>
										<div class="stat__track__name">` +
								stat[result.trackStats[index]].tracks[0].name +
								`</div>
									</div>
									<div class="stat__track"
										style="background-image: url(` +
								stat[result.trackStats[index]].tracks[1].imgSrc.slice(0, -5) +
								"150x150" +
								`);">
										<div class="stat__track__rate">#2</div>
										<div class="stat__track__name">` +
								stat[result.trackStats[index]].tracks[1].name +
								`</div>
									</div>
									<div
										class="stat__track"
										style="background-image: url(` +
								stat[result.trackStats[index]].tracks[2].imgSrc.slice(0, -5) +
								"150x150" +
								`);">
										<div class="stat__track__rate">#3</div>
										<div class="stat__track__name">` +
								stat[result.trackStats[index]].tracks[2].name +
								`</div>
									</div>
								</div>`;
						});
				}
				/* Создаю и внедряю кнопку анализировать */
				let newButton = document.createElement("button");
				newButton.textContent = "Анализировать";
				newButton.style.marginTop = "20px";
				newButton.style.marginBottom = "20px";
				newButton.style.alignSelf = "center";

				// Добавляем класс к кнопке
				newButton.classList.add("analyze__btn");
				this.injectedContent.appendChild(newButton);
				newButton.addEventListener("click", () => {
					this.analyzeBtnClickHandler();
				});
			}
		});
	}

	setInjectedContent(content) {
		this.injectedContent.innerHTML = content.content;
		switch (content.name) {
			case "noStatsContent":
				this.analyzeBtn = document.querySelector(".analyze__btn");
				this.analyzeBtn.addEventListener("click", () => {
					this.analyzeBtnClickHandler();
				});
				break;
			default:
				break;
		}
	}
}
const popup = new PopupInner();
popup.attachListeners();

let content = {
	noStatsContent: {
		name: "noStatsContent",
		content: `
		<div class="nav">
			<div class="nav__title">
				<span class="yandex__music">ЯндексМузыка</span>
				<span class="statistics">Statistics</span>
			</div>
		</div>
		<div class="app1__get__stats">
		<div class="get__stats__title">
				You don't have statistics yet... Click on the button to start data
				analysis
			</div>
			<button class="analyze__btn btn">Analyze</button>
		</div>`,
	},
	stats: {
		name: "stats",
		content: `<div class="nav">
						<div class="nav__title">
							<span class="yandex__music">ЯндексМузыка</span>
							<span class="statistics">Statistics</span>
						</div>
					</div>`,
	},
};
