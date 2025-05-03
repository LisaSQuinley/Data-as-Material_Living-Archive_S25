fetch("./detection_results.json")
  .then(res => res.json())
  .then(data => {
    detectionResults = data;  // Store the fetched data
    const labelData = countLabels(detectionResults);
    drawEmojiGrid(labelData);
  });

  const emojiMap = {
	"Confidence < 50": "🪴",
	"Confidence >= 50": "🌿",
	vase: "🏺",
	kite: "🪁",
	umbrella: "☂️",
	bird: "🐦‍⬛",
	bed: "🛏️",
	"teddy bear": "🧸",
	"dining table": "🍽️",
	apple: "🍏",
	orange: "🍊",
	airplane: "✈️",
	boat: "⛵",
	scissors: "✂️",
	clock: "🕰️",
	"sports ball": "🏀",
	cake: "🍰",
	horse: "🐴",
	tv: "📺",
};

function countLabels(data) {
  const labelCounts = {};

  data.forEach(item => {
    item.detections.forEach(d => {
      const label = d.label;
      const confidence = d.confidence;

      if (label === "potted plant") {
        // Split "potted plant" detections into two categories based on confidence
        if (confidence < 50) {
          labelCounts["Confidence < 50"] = (labelCounts["Confidence < 50"] || 0) + 1;
        } else if (confidence >= 50) {
          labelCounts["Confidence >= 50"] = (labelCounts["Confidence >= 50"] || 0) + 1;
        }
      } else {
        // Count other labels normally
        labelCounts[label] = (labelCounts[label] || 0) + 1;
      }
    });
  });

  // Convert the counts into the format needed for the chart
  return Object.entries(labelCounts).map(([label, count]) => ({ label, count }));
}
function drawEmojiGrid(labelData) {
	const container = document.getElementById("emoji-grid-container");
	container.innerHTML = ""; // Clear existing content

	// Sort categories by count (smallest first)
	labelData.sort((a, b) => a.count - b.count);

	labelData.forEach((item) => {
		const groupDiv = document.createElement("div");
		groupDiv.classList.add("emoji-group");

		if (item.count < 10) {
			groupDiv.classList.add("stacked-group");  // 👈 for small categories
		}

		const label = document.createElement("div");
		label.classList.add("emoji-label");
		label.textContent = item.label;
		groupDiv.appendChild(label);

		const emojiGrid = document.createElement("div");
		emojiGrid.classList.add("emoji-grid");

		const columns = Math.min(10, Math.ceil(Math.sqrt(item.count)));
		emojiGrid.style.gridTemplateColumns = `repeat(${columns}, 30px)`;

		const emojiChar = emojiMap[item.label] || "❓";
		for (let i = 0; i < item.count; i++) {
			const emoji = document.createElement("div");
			emoji.classList.add("emoji-cell");
			emoji.textContent = emojiChar;
			emojiGrid.appendChild(emoji);
		}

		groupDiv.appendChild(emojiGrid);
		container.appendChild(groupDiv);
	});
}
