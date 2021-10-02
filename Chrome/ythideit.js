var active = false;
var threshold = 90;

async function requestHandler(options, sender, sendResponse) {
	console.log("options :", options);
	if (options.removeSeenVids === true) {
		threshold = options.threshold;
		active = true;
		removeSeenVids();
	}
	else {
		const nodes = document.getElementsByClassName("yt-hide-seen-video");
		for (node of nodes) {
			node.classList.remove("yt-hide-seen-video");
			nodes[i].style.display = 'block';
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
	while (tmp && tmp.tagName != "YTD-VIDEO-RENDERER") {
		tmp = tmp.parentNode;
	}
	return tmp;
}

function removeSeenVids() {
	const hasProgress = document.getElementsByClassName("ytd-thumbnail-overlay-resume-playback-renderer");
	let toRemove = [];
	for (progress of hasProgress) {
		if (parseInt(progress.style.width.split("%")[0]) > threshold) {
			toRemove.push(getVideoContainer(progress));
		}
	}
	console.log("toRemove :", toRemove);
	removeVids(toRemove);
}

document.addEventListener("scroll", (e) => {
	if (active)
		removeSeenVids();
});

chrome.runtime.onMessage.addListener(requestHandler);