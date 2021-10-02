var active = false;
var threshold = 90;

async function requestHandler(request, sender, sendResponse) {
	if (request.removeSeenVids === true) {
		threshold = request.threshold;
		active = true;
		removeSeenVids();
	}
}

function removeVids(nodes) {
	for (let i = 0; i < nodes.length; i++)
		nodes[i].remove();
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
	removeVids(toRemove);
}

document.addEventListener("scroll", (e) => {
	if (active)
		removeSeenVids();
});

browser.runtime.onMessage.addListener(requestHandler);