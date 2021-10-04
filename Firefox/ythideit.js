var active = (localStorage.getItem("ythiderangevalue") == 'true') ? true : false;
var threshold = localStorage.getItem("ythiderangevalue") || 90;

const tagNames = [
	"YTD-VIDEO-RENDERER",
	"YTD-COMPACT-VIDEO-RENDERER",
	"YTD-GRID-VIDEO-RENDERER"
];

async function requestHandler(options, sender, sendResponse) {
	if (options.removeSeenVids === true) {
		threshold = options.threshold;
		localStorage.setItem("ythiderangevalue", options.threshold);
		localStorage.setItem("ythidebtnstate", 'true');
		active = true;
		removeSeenVids();
	}
	else {
		active = false;
		localStorage.setItem("ythiderangevalue", 'false');
		localStorage.setItem("ythidebtnstate", 'false');
		let nodes = document.getElementsByClassName("yt-hide-seen-video");
		for (let i = nodes.length - 1; i >= 0; i--) {
			nodes[i].style.display = 'block';
			nodes[i].classList.remove("yt-hide-seen-video")
		}
	}
}

function removeVids(nodes) {
	for (let i = 0; i < nodes.length; i++) {
		nodes[i].classList.add("yt-hide-seen-video");
		nodes[i].style.display = 'none';
	}
}

function getVideoContainer(node) {
	let tmp = node;
	while (tmp && tagNames.indexOf(tmp.tagName) == -1) {
		tmp = tmp.parentNode;
	}
	return tmp;
}

function removeSeenVids() {
	const hasProgress = document.getElementsByClassName("ytd-thumbnail-overlay-resume-playback-renderer");
	let toRemove = [];
	for (progress of hasProgress) {
		const container = getVideoContainer(progress);
		if (parseInt(progress.style.width.split("%")[0]) > threshold) {
			toRemove.push(container);
		}
		else if (container.classList.contains("yt-hide-seen-video")) {
			container.style.display = 'block';
			container.classList.remove("yt-hide-seen-video")
		}
	}
	removeVids(toRemove);
}

function searchProgress() {
	const hasProgress = document.getElementsByClassName("ytd-thumbnail-overlay-resume-playback-renderer");
	let is_active = localStorage.getItem("ythidebtnstate");
	if (hasProgress.length > 0 && is_active == 'true')
		removeSeenVids();
}

var refreshIntervalId = setInterval(searchProgress, 100);

browser.runtime.onMessage.addListener(requestHandler);