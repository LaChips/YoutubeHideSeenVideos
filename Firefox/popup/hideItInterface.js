/*
	Executed when the user click the hide/show button
	If currentState is 'false' we switch it to 'true' and change the button, and the other way around.
	Returns the new state
*/
function handleBtnChange(btn) {
	let state = localStorage.getItem("ythidebtnstate");
	if (state == 'false') {
		btn.target.classList.remove("active");
		btn.target.innerText = "Show";
		localStorage.setItem("ythidebtnstate", "true");
		return true;
	}
	else {
		btn.target.classList.add("active");
		btn.target.innerText = "Hide";
		localStorage.setItem("ythidebtnstate", "false")
		return false;
	}
}

/*
	Send a message containing an object made of 2 field, removeSeenVids (addon state : active / inactive) and the thresold
	All the YouTube tabs will receive the message
*/
function sendMessage(state, threshold) {
	var gettingActiveTab = browser.tabs.query({url: "*://*.youtube.com/*", currentWindow: true});
	gettingActiveTab.then((tabs) => {
		for (let tab of tabs)
			browser.tabs.sendMessage(tab.id, {removeSeenVids: state, threshold: threshold});
	});
}

/*
	Executed when the user click the hide/show button
	Compute the change and get the new state from handleBtnChange function
	Refresh the thresold localStorage item
	Call send message to notify YouTube tabs
*/
document.getElementById("hideitbtn").addEventListener("click", function(e) {
	const state = handleBtnChange(e);
	let threshold = localStorage.getItem("ythiderangevalue") || 90;
	sendMessage(state, threshold);
});

/*
	Listen for changes on the thresold range input, store it's new value in localStorage and calls sendMessage to refresh the tabs
*/
document.getElementById("threshold").addEventListener("change", function(e) {
	let state = (localStorage.getItem("ythidebtnstate") == 'true');
	const threshold = parseInt(e.target.value);
	document.getElementById("threshold_value").innerText = threshold + "%";
	localStorage.setItem("ythiderangevalue", threshold);
	sendMessage(state, threshold);
});

/*
	When addon is clicked we change the button, if needed, and the range value based on localStorage items
*/
document.addEventListener("DOMContentLoaded", (e) => {
	if (localStorage.getItem("ythidebtnstate") == 'true') {
		document.getElementById("hideitbtn").classList.add("active");
		document.getElementById("hideitbtn").innerText = "Show"
	}
	document.getElementById("threshold").value = localStorage.getItem("ythiderangevalue") || 90;
	document.getElementById("threshold_value").innerText = (localStorage.getItem("ythiderangevalue") || 90) + "%";
});