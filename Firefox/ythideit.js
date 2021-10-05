/*
	Vars init
	active : true if the addon is active; false otherwise
	thresold : progress bar percentage beyond this value will hide the associated video
	refreshIntervalId : Store a reference of the setInterval to stop it when needed
*/
var active = (localStorage.getItem("ythidebtnstate") == 'true') ? true : false;
var threshold = parseInt(localStorage.getItem("ythiderangevalue")) || 90;
var refreshIntervalId;

/*
	Videos containers possible names (differs depending on the display)
*/
const tagNames = [
	"YTD-VIDEO-RENDERER",
	"YTD-COMPACT-VIDEO-RENDERER",
	"YTD-GRID-VIDEO-RENDERER",
	"YTD-RICH-ITEM-RENDERER"
];

/*
	Handle message sent from interface script.
	options : Object containing the thresold and the removeSeenVids (active / true - inactive / false)
	If removeSeenVids is true we store the thresold in local storage as well as we switch state in localstorage (active)
	If removeSeenVids is false we remove our "display : block" css attribute and our "yt-hide-seen-video" from each hidden videos
	We also reset the setInterval in case of True and we stop it in case of False
*/
async function requestHandler(options, sender, sendResponse) {
	if (options.removeSeenVids === true) {
		threshold = options.threshold;
		localStorage.setItem("ythiderangevalue", options.threshold);
		localStorage.setItem("ythidebtnstate", 'true');
		active = true;
		refreshIntervalId = setInterval(searchProgress, 100);
		removeSeenVids();
	}
	else {
		active = false;
		localStorage.setItem("ythidebtnstate", 'false');
		let nodes = document.getElementsByClassName("yt-hide-seen-video");
		for (let i = nodes.length - 1; i >= 0; i--) {
			nodes[i].style.display = 'block';
			nodes[i].classList.remove("yt-hide-seen-video")
		}
		clearInterval(refreshIntervalId);
	}
}

/*
	Hide videos (HTML node array)
*/
function removeVids(nodes) {
	for (let i = 0; i < nodes.length; i++) {
		nodes[i].classList.add("yt-hide-seen-video");
		nodes[i].style.display = 'none';
	}
}

/*
	Search the video container parent tag from the progress bar node (UP) 
*/
function getVideoContainer(node) {
	let tmp = node;
	while (tmp && tagNames.indexOf(tmp.tagName) == -1) {
		tmp = tmp.parentNode;
	}
	return tmp;
}

/*
	Search for videos that has a progress bar (watched)
	Filter them based on the watched percentage according to the thresold
	Get their video container parent node
	Call removeVids with the video container array as parameter
*/
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

/*
	This function is called every 0.2 seconds
	If the addon is active it will call removeSeenVids to handle the videos to remove
*/
function searchProgress() {
	let is_active = localStorage.getItem("ythidebtnstate");
	if (is_active == 'true')
		removeSeenVids();
}

/*
	If active is true we start the setInterval
	Needed when user open a new YouTube tab or restart the browser
*/
if (active)
	refreshIntervalId = setInterval(searchProgress, 200);

/*
	Listen for message from interface script and use requestHandler as a callback
*/
browser.runtime.onMessage.addListener(requestHandler);