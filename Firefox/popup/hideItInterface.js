function handleBtnChange(btn) {
	let state = localStorage.getItem("ythidebtnstate");
	if (state == 'false') {
		btn.target.classList.add("active");
		btn.target.innerText = "Show";
		localStorage.setItem("ythidebtnstate", "true");
		return true;
	}
	else {
		btn.target.classList.remove("active");
		btn.target.innerText = "Hide";
		localStorage.setItem("ythidebtnstate", "false")
		return false;
	}
}

function sendMessage(state, threshold) {
	var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
	gettingActiveTab.then((tabs) => {
		browser.tabs.sendMessage(tabs[0].id, {removeSeenVids: state, threshold: threshold});
	});
}

document.getElementById("hideitbtn").addEventListener("click", function(e) {
	const state = handleBtnChange(e);
	let threshold = localStorage.getItem("ythiderangevalue") || 90;
	sendMessage(state, threshold);
});

document.getElementById("threshold").addEventListener("change", function(e) {
	document.getElementById("threshold_value").innerText = e.target.value + "%";
	localStorage.setItem("ythiderangevalue", parseInt(e.target.value));
});

document.addEventListener("DOMContentLoaded", (e) => {
	if (localStorage.getItem("ythidebtnstate") == 'true') {
		document.getElementById("hideitbtn").classList.add("active");
		document.getElementById("hideitbtn").innerText = "Show"
	}
	document.getElementById("threshold").value = localStorage.getItem("ythiderangevalue") || 90;
	document.getElementById("threshold_value").innerText = (localStorage.getItem("ythiderangevalue") || 90) + "%";
})