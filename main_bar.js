let detectionResults; // Declare a variable to hold the fetched data

fetch("./detection_results.json")
  .then(res => res.json())
  .then(data => {
    detectionResults = data;  // Store the fetched data
    const labelData = countLabels(detectionResults);
    drawBarChart(labelData);
  });

function countLabels(data) {
  const labelCounts = {};

  data.forEach(item => {
    item.detections.forEach(d => {
      const label = d.label;
      const confidence = d.confidence;

      if (label === "potted plant") {
        // Split "potted plant" detections into four categories based on confidence
        if (confidence < 25) {
          labelCounts["Confidence < 25"] = (labelCounts["Confidence < 25"] || 0) + 1;
        } else if (confidence >= 25 && confidence < 50) {
          labelCounts["25 <= Confidence < 50"] = (labelCounts["25 <= Confidence < 50"] || 0) + 1;
        } else if (confidence >= 50 && confidence < 75) {
          labelCounts["50 <= Confidence < 75"] = (labelCounts["50 <= Confidence < 75"] || 0) + 1;
        } else if (confidence >= 75) {
          labelCounts["Confidence >= 75"] = (labelCounts["Confidence >= 75"] || 0) + 1;
        }
      } else {
        // Count other labels normally
        labelCounts[label] = (labelCounts[label] || 0) + 1;
      }
    });
  });

  // Convert the counts into the format needed for the bar chart
  return Object.entries(labelCounts).map(([label, count]) => ({ label, count }));
}

function drawBarChart(labelData) {
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };

  // Dynamically set width and height based on viewport size (vw and vh)
  const width = window.innerWidth * 0.8;  // 80% of the viewport width
  const height = window.innerHeight * 0.8; // 80% of the viewport height

  const svg = d3
    .select("#funky-bar-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const x = d3
    .scaleBand()
    .domain(labelData.map(d => d.label))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(labelData, d => d.count)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg
    .selectAll(".bar")
    .data(labelData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.label))
    .attr("y", d => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", d => height - margin.bottom - y(d.count))
    .attr("fill", "steelblue");

  // Add event listener to resize the chart when the window is resized
  window.addEventListener('resize', () => {
    const labelData = countLabels(detectionResults); // Use the global detectionResults
    d3.select("#funky-bar-chart").html("");  // Clear the old chart
    drawBarChart(labelData);  // Redraw the chart with new size
  });
}
