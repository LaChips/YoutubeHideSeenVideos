document.getElementById("hideitbtn").addEventListener("click", async  function(e) {
	e.target.classList.add("active");
	let threshold = parseInt(document.getElementById("threshold").value);
	chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {
    	chrome.runtime.sendMessage({removeSeenVids: true, threshold: threshold});
    });
});

document.getElementById("threshold").addEventListener("change", function(e) {
	document.getElementById("threshold_value").innerText = e.target.value + "%";
});