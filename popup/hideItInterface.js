document.getElementById("hideitbtn").addEventListener("click", function(e) {
	let threshold = parseInt(document.getElementById("threshold").value);
	var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
	gettingActiveTab.then((tabs) => {
		console.log("threshold :", threshold);
		browser.tabs.sendMessage(tabs[0].id, {removeSeenVids: true, threshold: threshold});
	});
});

document.getElementById("threshold").addEventListener("change", function(e) {
	document.getElementById("threshold_value").innerText = e.target.value + "%";
});